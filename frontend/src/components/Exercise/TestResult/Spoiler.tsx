import { FC, useState } from 'react';
import { CommandLineIcon } from '@heroicons/react/24/solid';
import { EyeIcon } from '@heroicons/react/20/solid';
import { DiffEditor } from '@monaco-editor/react';

interface Props {
  output: string;
  expected: string;
}

const Spoiler: FC<Props> = ({ output, expected }: Props) => {

  const [open, setOpen] = useState(false);

  if (!open) return (<>
    <span className="font-monospace flex">
      <CommandLineIcon className="w-5 h-5 text-gray-600 hidden sm:inline" />
      &nbsp;
      <span className="flex items-center w-full">
        <pre className="grow overflow-x-scroll">{output}</pre>
        <button
          className='flex items-center gap-1 text-xs text-gray-500 hover:underline hover:text-gray-600 me-1 mt-1'
          onClick={() => setOpen(true)}
        >
          <EyeIcon className='size-3' />
          Show diff
        </button>
      </span>
    </span>
  </>)

  const diffEditorHeight = output.split("\n").length * 20 + 20;

  return (
    <div className="border my-2">
      <DiffEditor
        original={output}
        modified={expected}
        language="plaintext"
        theme="light"
        height={diffEditorHeight}
        options={{
          automaticLayout: true,
          enableSplitViewResizing: false,
          renderSideBySide: false,
          readOnly: true,
          minimap: {
            enabled: false,
          },
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: "hidden",
            alwaysConsumeMouseWheel: false,
          },
        }}
      />
    </div>
  );
}

export default Spoiler;
