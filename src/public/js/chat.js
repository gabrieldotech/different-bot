// public/js/chat.js

document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messages');
    
    // Adiciona uma mensagem à janela de chat
    const appendMessage = (sender, content) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender === 'ia' ? 'ia' : 'user');
        messageDiv.innerHTML = content.replace(/\n/g, '<br>'); 
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    
    // Carrega o histórico de conversas do usuário logado
    const loadHistory = async () => {
        try {
            const response = await fetch('/api/chat/history');
            if (response.ok) {
                const data = await response.json();
                
                if (data.history && data.history.length > 0) {
                    messagesContainer.innerHTML = ''; 
                    
                    data.history.forEach(msg => {
                        const sender = msg.role === 'user' ? 'user' : 'ia'; 
                        appendMessage(sender, msg.content);
                    });
                } else {
                    appendMessage('ia', 'Olá! Sou o Chatbot Groq. Faça sua primeira pergunta.');
                }
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            appendMessage('ia', '[ERRO]: Falha ao carregar o histórico de conversas.');
        }
    };
    
    // Função principal para enviar a mensagem
    const sendMessage = async () => {
        const message = userInput.value.trim();
        if (message === "") return;

        // 1. Exibe a mensagem do usuário e desabilita o botão
        appendMessage('user', message);
        userInput.value = ''; 
        sendBtn.disabled = true;

        try {
            // 2. Envia a mensagem para o backend (/api/chat)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            // 3. Exibe a resposta da IA (o backend já salvou no Firestore)
            if (response.ok) {
                appendMessage('ia', data.response);
            } else {
                appendMessage('ia', `[ERRO]: ${data.message || 'Falha ao processar a resposta da IA.'}`);
            }

        } catch (error) {
            console.error('Erro de rede ou servidor:', error);
            appendMessage('ia', `[ERRO CRÍTICO]: Erro de conexão com o servidor.`);
        } finally {
            sendBtn.disabled = false;
        }
    };

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // CHAMA A FUNÇÃO DE CARREGAMENTO AO INICIAR
    loadHistory();
});