/* global marked, hljs */
import './App.css';
import gpt from './assets/chatgptLogo.svg';
import user from './assets/user-icon.png';
import send from './assets/send.svg';
import chatLogo from './assets/chatgpt.svg';
import chatBtn from './assets/add-30.png';
import bookmark from './assets/bookmark.svg';
import message from './assets/message.svg';
import upgrade from './assets/rocket.svg';
import home from './assets/home.svg';
import { sendMessageToGemini } from './gemini';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [chats, setChats] = useState([]);
  const chatContainerRef = useRef(null);
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);



  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setChats(prev => [...prev, { role: 'user', text: input }]);

    try {
      const answer = await sendMessageToGemini(input);
      let parsed = marked.parse(answer);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = parsed;

      tempDiv.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });

      const finalHTML = tempDiv.innerHTML;
      setChats(prev => [...prev, { role: 'assistant', text: finalHTML }]);
    } catch (e) {
      setChats(prev => [...prev, { role: 'assistant', text: 'Error: ' + e.message }]);
    }

    setInput('');
  };

  return (
    <div className="App">
      {/* -------------- sidebar ---------------- */}
      <div className="sideBar">
        <div className="upper">
          <div className="logo">
            <img src={chatLogo} alt="logo" />
            <span className="name">MyGpt</span>
          </div>

          <button className="midbtn" onClick={() => setChats([])}>
            <img className="chatBtn" src={chatBtn} alt="" />
            New Chat
          </button>

          <div className="upperbottom">
            <button className="qyery"><img src={message} alt="" />what is programming?</button>
            <button className="qyery"><img src={message} alt="" />How to use an API?</button>
          </div>
        </div>

        <div className="lower">
          <div className="listItem"><img src={home} alt="" />Home</div>
          <div className="listItem"><img src={bookmark} alt="" />Generate Image</div>
          <div className="listItem"><img src={upgrade} alt="" />Upgrade To Pro</div>
        </div>
      </div>

      {/* -------------- main ---------------- */}
      <div className="main">

        <div className="toggle-wrapper">
        <button
          className={`toggle-mode ${darkMode ? 'dark' : 'light'}`}
          onClick={() => setDarkMode(prev => !prev)}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>

        </div>

        <div className="chats" ref={chatContainerRef}>
          {chats.length === 0 ? (
            <div className="starter-message">
              <p>Hello there!🙋</p>
              <p>How can I help you ?</p>
            </div>
          ) : (
            chats.map((c, i) => (
              <div key={i} className="chat">
                <img
                  className={c.role === 'assistant' ? 'gptlogo' : ''}
                  src={c.role === 'assistant' ? gpt : user}
                  alt=""
                />
                {c.role === 'assistant' ? (
                  <div dangerouslySetInnerHTML={{ __html: c.text }} />
                ) : (
                  <p>{c.text}</p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="footer">
          <div className="inp">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="send" onClick={handleSend}>
              <img src={send} alt="send" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
