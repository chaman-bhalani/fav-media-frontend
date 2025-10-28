import { useState } from "react";
import EntriesTable from "./components/entriesTable";
import EntryForm from "./components/entryForm";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [key, setKey] = useState(0); // trick to refresh table

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Favorite Movies & TV Shows</h1>
        <div>
          <button
            className="px-4 py-2 rounded-xl text-white cursor-pointer 
  bg-gradient-to-r from-amber-600 to-yellow-500 
  hover:from-amber-700 hover:to-yellow-600 
  transition-all duration-200"
            onClick={() => {
              setEditing(null);
              setIsOpen(true);
            }}
          >
            + Add Entry
          </button>
        </div>
      </div>

      <EntriesTable
        onEdit={(e) => {
          setEditing(e);
          setIsOpen(true);
        }}
        key={key}
      />

      <EntryForm
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        onSaved={() => setKey((k) => k + 1)}
        initial={editing}
      />
    </div>
  );
}

export default App;
