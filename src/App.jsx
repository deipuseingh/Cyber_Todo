import { useCallback, useEffect, useRef, useState } from "react";
import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "./appwrite";
import "./App.css";

function getAppwriteErrorMessage(error, fallback) {
  return error?.message ? `${fallback} ${error.message}` : fallback;
}

const particleDelays = Array.from({ length: 26 }, (_, index) => ({
  "--delay": `${index * -0.62}s`,
  "--x": `${(index % 9) * 12 - 48}vw`,
  "--x-end": `${((index % 9) * 12 - 48) * -0.25}vw`,
  "--z": `${(index % 7) * 42}px`,
}));

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const shellRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const completedTasks = tasks.filter((task) => task.isDone).length;
  const activeTasks = tasks.length - completedTasks;

  const handlePointerMove = (event) => {
    const shell = shellRef.current;
    if (!shell) return;

    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;

    shell.style.setProperty("--cursor-x", x.toFixed(3));
    shell.style.setProperty("--cursor-y", y.toFixed(3));
  };

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        [Query.orderDesc("$createdAt")],
      );

      setTasks(response.documents);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setErrorMessage(
        getAppwriteErrorMessage(error, "Could not load tasks from Appwrite."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (event) => {
    event.preventDefault();
    const title = newTaskText.trim();
    if (!title) return;

    setErrorMessage("");

    try {
      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        ID.unique(),
        { title, isDone: false },
      );

      setTasks((currentTasks) => [response, ...currentTasks]);
      setNewTaskText("");
    } catch (error) {
      console.error("Error adding task:", error);
      setErrorMessage(getAppwriteErrorMessage(error, "Could not add the task."));
    }
  };

  const handleToggleDone = async (id, currentStatus) => {
    setErrorMessage("");

    try {
      const response = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        id,
        {
          isDone: !currentStatus,
        },
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.$id === id ? response : task)),
      );
    } catch (error) {
      console.error("Error updating task:", error);
      setErrorMessage(
        getAppwriteErrorMessage(error, "Could not update the task."),
      );
    }
  };

  const handleDeleteTask = async (id) => {
    setErrorMessage("");

    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collectionId,
        id,
      );

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.$id !== id),
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      setErrorMessage(
        getAppwriteErrorMessage(error, "Could not delete the task."),
      );
    }
  };

  return (
    <main
      ref={shellRef}
      className="app-shell"
      onPointerMove={handlePointerMove}
    >
      <div className="scene-background" aria-hidden="true">
        <div className="neon-skyline">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="grid-floor" />
        <div className="holo-core">
          <div className="core-ring ring-one" />
          <div className="core-ring ring-two" />
          <div className="core-ring ring-three" />
        </div>
        <div className="particle-field">
          {particleDelays.map((style, index) => (
            <span key={index} className="particle" style={style} />
          ))}
        </div>
      </div>

      <section className="cyber-container" aria-label="Cyber todo list">
        <div className="panel-chrome">
          <span>SYS:TASK_MATRIX</span>
          <span>APPWRITE:ONLINE</span>
        </div>

        <h1 className="animate-glitch title">CYBER_TODO</h1>

        <div className="status-deck" aria-label="Task summary">
          <div>
            <span className="status-value">{tasks.length}</span>
            <span className="status-label">TOTAL</span>
          </div>
          <div>
            <span className="status-value">{activeTasks}</span>
            <span className="status-label">ACTIVE</span>
          </div>
          <div>
            <span className="status-value">{completedTasks}</span>
            <span className="status-label">DONE</span>
          </div>
        </div>

        <form onSubmit={handleAddTask} className="input-group">
          <input
            type="text"
            className="cyber-input"
            placeholder="ENTER_TASK..."
            value={newTaskText}
            onChange={(event) => setNewTaskText(event.target.value)}
          />
          <button
            type="submit"
            className="cyber-button"
          >
            ADD
          </button>
        </form>

        {errorMessage ? <div className="error-text">{errorMessage}</div> : null}

        <div className="task-list">
          {isLoading ? (
            <div className="loading-text">LOADING_DATA...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-text">NO_ACTIVE_TASKS.</div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.$id}
                className={`task-item ${task.isDone ? "done" : ""}`}
              >
                <div
                  className="task-content"
                  onClick={() => handleToggleDone(task.$id, task.isDone)}
                >
                  <span className="checkbox">
                    {task.isDone ? "[X]" : "[ ]"}
                  </span>
                  <span className="task-title">{task.title}</span>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteTask(task.$id)}
                >
                  DEL
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
