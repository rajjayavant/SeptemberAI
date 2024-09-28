import React, { useEffect, useState, useRef } from 'react';
import './HomePage.css';
import watermark from '../assets/watermark.svg';
import logo from '../assets/logo.svg';
import toggleIcon from '../assets/toggleIcon.svg';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import fetchResponse from '../fetchResponse';
import { Client } from "@gradio/client";
import { Hexagon } from 'lucide-react';
import Markdown from 'react-markdown'

const HomePage = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [conversationList, setConversationList] = useState([]);
    const [client, setClient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chatSummary, setChatSummary] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [hasSidebarEverOpened, setHasSidebarEverOpened] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        initializeClient();
    }, []);

    useEffect(() => {
        scrollToBottom();
        const messageCount = conversationList.length;
        if ( messageCount === 2 ) {
            generateSummary();
        }
    }, [conversationList]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const initializeClient = async () => {
        try {
            const newClient = await Client.connect("Be-Bo/llama-3-chatbot_70b");
            console.log("client connected")
            const sysPrompt = "You are a chatbot named September, remember who you are throughout the session."
            const sysResponse = await fetchResponse(newClient, sysPrompt);
            setClient(newClient);
        } catch (e) {
            console.error("Failed to initialize client:", e);
            setClient('failed');
        }
    }

    const toggleSidebar = () => {
        if (!isSideBarOpen && !hasSidebarEverOpened && conversationList.length >= 2) {
            generateSummary();
            setHasSidebarEverOpened(true);
        }
        setIsSideBarOpen(!isSideBarOpen);
    };

    const handleSendMessage = async (message) => {
        if (client === 'failed') {
            console.error("Client initialization failed. Cannot send message.");
            return;
        }

        setConversationList(prev => [...prev, { type: 'user', text: message }]);
        setIsLoading(true);

        try {
            const response = await fetchResponse(client, message);
            setConversationList(prev => [...prev, { type: 'bot', text: response }]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setConversationList(prev => [...prev, { type: 'error', text: "Sorry, there was an error processing your request." }]);
            console.log(client);
        } finally {
            setIsLoading(false);
        }
    };

    const generateSummary = async () => {
        if (conversationList.length < 2) {
            setChatSummary('');
            return;
        }

        setIsSummaryLoading(true);

        const summaryPrompt = 'Summarize the conversation in numbered bullet points. Please dont include the first from prompt where you were told to be called September. Make it seem like a 3rd person is summarizing our conversation.';

        try {
            const summary = await fetchResponse(client, summaryPrompt);
            setChatSummary(summary);
        } catch (error) {
            console.error("Error generating summary:", error);
            setChatSummary("Failed to generate summary. Please try again.");
        } finally {
            setIsSummaryLoading(false);
        }
    };

    return (
        <div className={`app ${isSideBarOpen ? 'sidebar-open' : ''}`}>
            <header className='app-header'>
                <img src={logo} className='logo' alt="SEPTEMBER" />
                {!isSideBarOpen && (
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <img src={toggleIcon} className='toggle-icon' alt="toggle-icon" />
                    </button>
                )}
            </header>
            <div className='app-body'>
                <main className='main-content'>
                    {conversationList.length === 0 ? (
                        <img src={watermark} className='watermark' alt="watermark" />
                    ) : (
                        <div className="messages-container">
                            {conversationList.map((item, index) => (
                                <div key={index} className={`message ${item.type}`}>
                                    {item.type === 'bot' && <Hexagon size={24} className="bot-icon" />}
                                    <div className="message-text">
                                        <Markdown>{item.text}</Markdown>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message bot">
                                    <Hexagon size={24} className="bot-icon" />
                                    <div className="message-text">Thinking...</div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </main>
            </div>
            {(client != null) ? <footer className='app-footer'>
                <SearchBar onSendMessage={handleSendMessage} isLoading={isLoading} />
            </footer> : <div className="loading-message">
                <Hexagon size={48} className="loading-icon" />
                <p>September is booting up...</p>
            </div>}
            <Sidebar
                isOpen={isSideBarOpen}
                onClose={toggleSidebar}
                chatSummary={chatSummary}
                onRegenerateSummary={generateSummary}
                isSummaryLoading={isSummaryLoading}
            />
        </div>
    );
}

export default HomePage;