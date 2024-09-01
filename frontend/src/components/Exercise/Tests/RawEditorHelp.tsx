import React, { useState } from "react";

const RawEditorHelp = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="text-sm mb-2 text-gray-500 hover:underline"
        onClick={() => setOpen(!open)}
      >
        Help on Raw Editor
      </button>

      {open && (
        <div className="bg-indigo-50 rounded mb-2 text-sm p-4">
          <p>
            Put a well-formatted JSON array into the editor, and click "Save
            tests". <br />
            <br />
            Example :
            <pre className="bg-indigo-100 text-indigo-950 rounded text-xs p-1">
              {`[
    {
        "name": "1 + 1",
        "stdin": "1 1",
        "stdout": "2"
    },
    {
        "name": "3 + 4",
        "stdin": "3 4",
        "stdout": "7"
    }
]`}
            </pre>
            <br />
            Tips :
            <ol className="list-decimal list-inside">
              <li>
                Only objects with the&nbsp;
                <b>
                  <code>name</code>, <code>stdin</code> and <code>stdout</code>{" "}
                  keys
                </b>{" "}
                are accepted.
              </li>
              <li>
                Make sure the editor shows no{" "}
                <span className="underline decoration-wavy decoration-red-500">
                  red squiggle
                </span>{" "}
                before you submit.
              </li>
            </ol>
          </p>
        </div>
      )}
    </div>
  );
};

export default RawEditorHelp;
