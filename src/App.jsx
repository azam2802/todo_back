import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState("");
  const [newName, setNewName] = useState("");

  const getTodos = () => {
    setIsLoading(true);
    axios
      .get(
        "https://api.elchocrud.pro/api/v1/28155e5f6eeaed713f32235e02556971/todo"
      )
      .then((res) => {
        setTodos(res.data);
      })
      .then(() => {
        setIsLoading(false);
      });
  };

  const postNewTodo = (todo) => {
    setIsLoading(true);
    if (todo == "") {
      return setIsLoading(false);
    } else {
      axios
        .post(
          "https://api.elchocrud.pro/api/v1/28155e5f6eeaed713f32235e02556971/todo",
          {
            todo: todo,
            isDone: false,
          }
        )
        .then(() => getTodos())
        .then(() => setNewTodo(""))
        .then(() => {
          setIsLoading(false);
        });
    }
  };

  const deleteTodo = (id) => {
    setIsLoading(true);
    axios
      .delete(
        `https://api.elchocrud.pro/api/v1/28155e5f6eeaed713f32235e02556971/todo/${id}`
      )
      .then(() => {
        getTodos();
      })
      .then(() => {
        setIsLoading(false);
      })
      .then(() => setIsEditing(""));
  };

  const setDoneTodo = (id, done) => {
    setIsLoading(true);
    axios
      .patch(
        `https://api.elchocrud.pro/api/v1/28155e5f6eeaed713f32235e02556971/todo/${id}`,
        {
          isDone: done,
        }
      )
      .then(() => {
        getTodos();
      })
      .then(() => {
        setIsLoading(false);
      });
  };

  const changeTodoName = (id, name) => {
    setIsLoading(true);
    axios
      .patch(
        `https://api.elchocrud.pro/api/v1/28155e5f6eeaed713f32235e02556971/todo/${id}`,
        {
          todo: name,
        }
      )
      .then(() => {
        getTodos();
      })
      .then(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => getTodos(), []);

  return (
    <>
      <h1>TODO LIST:</h1>
      {isLoading ? (
        <h3>Loading... wait please</h3>
      ) : (
        <div>
          <input
            className="addTodo"
            type="text"
            placeholder="Add todo"
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button onClick={() => postNewTodo(newTodo)}>Add new todo</button>
          {todos.map((item) => (
            <div key={item._id}>
              <div className="todo">
                <input
                  type="checkbox"
                  onChange={() => {
                    item.isDone == "on"
                      ? setDoneTodo(item._id, "off")
                      : setDoneTodo(item._id, "on");
                  }}
                  checked={item.isDone == "on" ? true : false}
                />
                {item.isDone == "on" ? <p className="crossed">{item.todo}</p> : <p>{item.todo}</p>}
                <button onClick={() => deleteTodo(item._id)}>delete</button>
                <button
                  onClick={() =>
                    setIsEditing(
                      isEditing != "" && item._id == isEditing ? "" : item._id
                    )
                  }
                >
                  Edit
                </button>
              </div>
              {isEditing == item._id && (
                <form
                  onSubmit={() => {
                    changeTodoName(
                      item._id,
                      newName == "" ? item.todo : newName
                    );
                    setIsEditing("");
                  }}
                >
                  <input
                    type="text"
                    placeholder="New todo name"
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  <button type="submit">Submit</button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default App;
