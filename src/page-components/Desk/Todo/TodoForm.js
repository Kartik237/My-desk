import React, { useState, useEffect, useRef } from "react";
import { addTodo } from "../../../actions/actions";

function TodoForm(props) {
  const [input, setInput] = useState(props.edit ? props.edit.value : "");

  let email = localStorage.getItem("googleEmail");

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log("hi")

    props.onSubmit({
      id: Math.floor(Math.random() * 10000),
      text: input,
    });
    setInput("");

    let d = new Date();
    const dateFull = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getUTCDate()}`;
    const timeFull = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

    addTodo(email, input, dateFull, timeFull);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      {props.edit ? (
        <>
          <input
            placeholder="Update your item"
            value={input}
            onChange={handleChange}
            name="text"
            ref={inputRef}
            className="todo-input edit"
          />
          <button onClick={handleSubmit} className="todo-button edit">
            Update
          </button>
        </>
      ) : (
        <>
          <input
            placeholder="Add a todo"
            value={input}
            onChange={handleChange}
            name="text"
            className="todo-input"
            ref={inputRef}
          />
          <button onClick={() => handleSubmit} className="todo-button">
            Add todo
          </button>
        </>
      )}
    </form>
  );
}

export default TodoForm;
