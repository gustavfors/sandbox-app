import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:8000");

const names = [
  "Scarlett Johansson",
  "Robert Downey",
  "Samuel Jackson",
  "Chris Hemsworth",
  "Chris Evans",
  "Zoe Saldana",
  "Tom Hanks",
  "Johnny Depp",
];

const App = () => {
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState(
    names[Math.floor(Math.random() * names.length)]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("send_message", { body, author });
    setBody("");
  };

  useEffect(() => {
    socket.on("join", (history) => {
      setMessages(history);
    });

    socket.on("recieve_message", (data) => {
      setMessages((prevState) => {
        return [...prevState, data];
      });
    });
  }, [socket]);

  return (
    <>
      <div className="overflow-hidden" style={{ maxWidth: "480px" }}>
        <ul
          className=" overflow-x-hidden overflow-y-scroll flex flex-col-reverse"
          style={{ height: "61vh" }}
        >
          {messages
            .slice(0)
            .reverse()
            .map((message, index) => {
              return (
                <li
                  key={index}
                  className="text-gray-300 flex items-center space-x-3 my-3"
                >
                  <div class="flex-shrink-0 h-10 w-10 bg-pink-600 text-base flex items-center justify-center font-semibold rounded-full shadow-xl">
                    {message.author[0]}
                  </div>
                  <div className="text-gray-300">
                    <div>
                      <span className="text-pink-600 font-semibold">
                        {message.author}{" "}
                      </span>
                      <span className="text-xs">Idag 19:20</span>
                    </div>
                    <div className="text-sm">{message.body}</div>
                  </div>
                </li>
              );
            })}
        </ul>

        <form
          className="mt-6 shadow-xl"
          onSubmit={handleSubmit}
          style={{ height: "auto" }}
        >
          <input
            type="text"
            autocomplete="off"
            value={body}
            className="w-full p-4 rounded-t-lg border-b text-sm focus:outline-none focus:shadow-outline"
            placeholder="Enter message..."
            onChange={(e) => setBody(e.target.value)}
          />
          <button className="bg-pink-600 block w-full p-4 rounded-lg rounded-t-none font-semibold text-white text-sm">
            Send Message
          </button>
        </form>
      </div>
    </>
  );
};

export default App;
