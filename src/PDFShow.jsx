import * as React from "react";
import { highlightPlugin, MessageIcon } from "@react-pdf-viewer/highlight";
import {
  Button,
  Position,
  PrimaryButton,
  Tooltip,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const DisplayNotesSidebarExample = ({ fileUrl }) => {
  const [message, setMessage] = React.useState("");
  const [notes, setNotes] = React.useState([]);
  let noteId = notes.length;

  const noteEles = new Map();

  const renderHighlightTarget = (props) => (
    <div
      style={{
        background: "#eee",
        display: "flex",
        position: "absolute",
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: "translate(0, 8px)",
        zIndex: 1,
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={props.toggle}>
            <MessageIcon />
          </Button>
        }
        content={() => <div style={{ width: "100px" }}>Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const renderHighlightContent = (props) => {
    const addNote = () => {
      if (message !== "") {
        const note = {
          id: ++noteId,
          content: message,
          highlightAreas: props.highlightAreas,
          quote: props.selectedText,
        };
        setNotes(notes.concat([note]));
        props.cancel();
      }
    };

    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0, 0, 0, .3)",
          borderRadius: "2px",
          padding: "8px",
          position: "absolute",
          left: `${props.selectionRegion.left}%`,
          top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
          zIndex: 1,
        }}
      >
        <div>
          <textarea
            rows={3}
            style={{
              border: "1px solid rgba(0, 0, 0, .3)",
            }}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "8px",
          }}
        >
          <div style={{ marginRight: "8px" }}>
            <PrimaryButton onClick={addNote}>Add</PrimaryButton>
          </div>
          <Button onClick={props.cancel}>Cancel</Button>
        </div>
      </div>
    );
  };

  const jumpToNote = (note) => {
    if (noteEles.has(note.id)) {
      noteEles.get(note.id).scrollIntoView();
    }
  };

  const renderHighlights = (props) => (
    <div>
      {notes.map((note) => (
        <React.Fragment key={note.id}>
          {note.highlightAreas
            .filter((area) => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                style={Object.assign(
                  {},
                  {
                    background: "yellow",
                    opacity: 0.4,
                  },
                  props.getCssProperties(area, props.rotation)
                )}
                onClick={() => jumpToNote(note)}
                ref={(ref) => {
                  noteEles.set(note.id, ref);
                }}
              />
            ))}
        </React.Fragment>
      ))}
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    renderHighlights,
  });

  const { jumpToHighlightArea } = highlightPluginInstance;

  return (
    <div
      style={{
        border: "1px solid rgba(0, 0, 0, 0.3)",
        display: "flex",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          borderRight: "1px solid rgba(0, 0, 0, 0.3)",
          width: "50%",
          overflow: "auto",
        }}
      >
        {notes.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>There is no note</div>
        )}
        <div
          style={{
            height: "50%",
            paddingTop: 20,
          }}
        >
          {notes.map((note) => (
            <div style={{ margin: 10 }}>
              <h4>{note.content}</h4>
            </div>
          ))}
        </div>
        {notes.map((note) => {
          return (
            <div>
              <div
                key={note.id}
                style={{
                  borderBottom: "1px solid rgba(0, 0, 0, .3)",
                  padding: "8px",
                }}
              >
                {note.highlightAreas.map((ele, key) => (
                  <div style={{ marginLeft: 10 }}>
                    x: {Math.round(ele.left)}, y: {Math.round(ele.top)}, width:{" "}
                    {Math.round(ele.width)}, height: {Math.round(ele.height)}
                    <span>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          jumpToHighlightArea(note.highlightAreas[key])
                        }
                      >
                        {note.content}
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          flex: "1 1 0",
          overflow: "auto",
          height: "100vh",
        }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
          <Viewer fileUrl={fileUrl} plugins={[highlightPluginInstance]} />
        </Worker>
      </div>
    </div>
  );
};

export default DisplayNotesSidebarExample;
