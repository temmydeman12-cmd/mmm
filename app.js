document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('messages-container');
    const tasksContainer = document.getElementById('tasks-container');
    const clearTasksBtn = document.getElementById('clear-tasks-btn');

    // --- State Management ---
    // Load tasks from localStorage or initialize empty array
    let tasks = JSON.parse(localStorage.getItem('nexus_tasks')) || [];

    // --- Task Management Functions ---
    const saveTasks = () => {
        localStorage.setItem('nexus_tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        tasksContainer.innerHTML = '';
        
        if (tasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-tasks">
                    <i class="ph ph-list-dashes"></i>
                    <p>No tasks yet.<br>Ask me to set one!</p>
                </div>
            `;
            return;
        }

        tasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            taskEl.innerHTML = `
                <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                <div class="task-content">${escapeHTML(task.text)}</div>
            `;
            
            tasksContainer.appendChild(taskEl);
        });

        // Add event listeners to new checkboxes
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                toggleTask(e.target.dataset.id, e.target.checked);
            });
        });
    };

    const addTask = (text) => {
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.unshift(newTask); // Add to top
        saveTasks();
        renderTasks();
    };

    const toggleTask = (id, isCompleted) => {
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = isCompleted;
            saveTasks();
            renderTasks();
        }
    };

    const clearCompletedTasks = () => {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    };

    // --- Chat Functions ---
    const scrollToBottom = () => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const addMessageToUI = (text, isUser = false) => {
        const msgEl = document.createElement('div');
        msgEl.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        let avatarHTML = isUser ? 
            `<div class="message-avatar"><i class="ph ph-user"></i></div>` : 
            `<div class="message-avatar"><i class="ph ph-robot"></i></div>`;
            
        msgEl.innerHTML = `
            ${avatarHTML}
            <div class="message-content">${escapeHTML(text)}</div>
        `;
        
        // Remove typing indicator if it exists
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }

        messagesContainer.appendChild(msgEl);
        scrollToBottom();
    };

    const showTypingIndicator = () => {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'message ai-message typing-indicator';
        indicator.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;
        messagesContainer.appendChild(indicator);
        scrollToBottom();
    };

    // --- AI Logic ---
    const processUserInput = (input) => {
        const lowerInput = input.toLowerCase();
        
        // Task Extraction Patterns
        const taskPrefixes = [
            "remind me to ",
            "set a task to ",
            "set task to ",
            "add a task to ",
            "add task to ",
            "i need to ",
            "remind me about "
        ];

        let extractedTask = null;

        for (const prefix of taskPrefixes) {
            if (lowerInput.startsWith(prefix) || lowerInput.includes(` ${prefix}`)) {
                // Heuristic: take everything after the prefix
                const startIndex = lowerInput.indexOf(prefix) + prefix.length;
                extractedTask = input.substring(startIndex).trim();
                
                // Capitalize first letter
                if (extractedTask.length > 0) {
                    extractedTask = extractedTask.charAt(0).toUpperCase() + extractedTask.slice(1);
                }
                break;
            }
        }

        return new Promise((resolve) => {
            // Simulate very fast thinking time (400-800ms)
            const thinkingTime = Math.floor(Math.random() * 400) + 400;
            
            setTimeout(() => {
                if (extractedTask) {
                    addTask(extractedTask);
                    resolve(`I've added "${extractedTask}" to your tasks.`);
                } else {
                    // Basic conversational responses if no task is detected
                    const responses = [
                        "I'm here for you! Tell me more.",
                        "That's interesting. What else is on your mind?",
                        "I can certainly help with that.",
                        "Noted. Do you want me to set a reminder for anything related to this?",
                        "I am processing your request. As your PA, what should we focus on next?",
                        "Fascinating. Let's explore that further if you're bored!"
                    ];
                    
                    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
                        resolve("Hello! How can I assist you today?");
                    } else if (lowerInput.includes("how are you")) {
                        resolve("I'm running perfectly, thanks for asking! Ready to tackle your tasks.");
                    } else if (lowerInput.includes("bored")) {
                        resolve("If you're bored, we could brainstorm ideas, plan your week, or just chat about a topic you enjoy. What sounds good?");
                    } else {
                        // Random generic response
                        const randomResp = responses[Math.floor(Math.random() * responses.length)];
                        resolve(randomResp);
                    }
                }
            }, thinkingTime);
        });
    };

    // --- Event Listeners ---
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Add user message
        addMessageToUI(text, true);
        chatInput.value = '';

        // 2. Show thinking
        showTypingIndicator();

        // 3. Process and respond
        const response = await processUserInput(text);
        addMessageToUI(response, false);
    });

    clearTasksBtn.addEventListener('click', () => {
        clearCompletedTasks();
    });

    // Utility to prevent XSS
    function escapeHTML(str) {
        let div = document.createElement('div');
        div.innerText = str;
        return div.innerHTML;
    }

    // --- Initialization ---
    renderTasks();
});
