import React, { useState } from 'react';
import { MessageSquare, Smile, Paperclip, Mic } from 'lucide-react';

interface MessageInputProps {
    onSend: (message: string, type: 'text' | 'image' | 'voice') => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message, 'text');
            setMessage('');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Handle file upload logic here
            const reader = new FileReader();
            reader.onload = () => {
                onSend(reader.result as string, 'image');
            };
            reader.readAsDataURL(file);
        }
    };

    const startRecording = () => {
        setIsRecording(true);
        // Implement voice recording logic here
    };

    const stopRecording = () => {
        setIsRecording(false);
        // Implement stop recording and send logic here
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-2">
                <button
                    type="button"
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <Smile size={20} />
                </button>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                />
                <label
                    htmlFor="file-upload"
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                    <Paperclip size={20} />
                </label>
                <button
                    type="button"
                    className={`p-2 rounded-full ${
                        isRecording ? 'text-red-500' : 'text-gray-500'
                    } hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                >
                    <Mic size={20} />
                </button>
                <button
                    type="submit"
                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                    disabled={!message.trim()}
                >
                    <MessageSquare size={20} />
                </button>
            </div>
        </form>
    );
};

export default MessageInput; 