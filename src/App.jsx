import React, { useState } from "react";

import "./App.css";
import pdfFile1 from "./pdf/1st.pdf";
import pdfFile2 from "./pdf/2nd.pdf";
import pdfFile3 from "./pdf/3rd.pdf";

import DisplayNotesSidebarExample from "./PDFShow.jsx";
import Upload from "./Upload.jsx";

export const App = () => {
  // for submit event
  const [viewPdf, setViewPdf] = useState(null);
  return (
    <React.Fragment>
      {viewPdf && <DisplayNotesSidebarExample fileUrl={viewPdf} />}
      {!viewPdf && (
        <div className="head">
          <h2>Documents</h2>
          <hr></hr>
          <ul>
            <li>
              <button
                className="button-link"
                onClick={() => setViewPdf(pdfFile1)}
              >
                File 1
              </button>
            </li>
            <li>
              <button
                className="button-link"
                onClick={() => setViewPdf(pdfFile2)}
              >
                File 2
              </button>
            </li>
            <li>
              <button
                className="button-link"
                onClick={() => setViewPdf(pdfFile3)}
              >
                File 3
              </button>
            </li>
          </ul>
          <Upload state={viewPdf} setState={setViewPdf} />
        </div>
      )}
    </React.Fragment>
  );
};

export default App;
