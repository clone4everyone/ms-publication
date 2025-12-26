import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function usePageNotes(id, currentPage, showPdfViewer, user) {
  const [pageNotes, setPageNotes] = useState({});
  const [currentPageNote, setCurrentPageNote] = useState('');
  const [showNotesPanel, setShowNotesPanel] = useState(false);

  useEffect(() => {
    if (showPdfViewer && user.role === 'reviewer') {
      const savedNotes = localStorage.getItem(`submission_notes_${id}`);
      if (savedNotes) {
        setPageNotes(JSON.parse(savedNotes));
      }
    }
  }, [showPdfViewer, id, user.role]);

  useEffect(() => {
    if (pageNotes[currentPage]) {
      setCurrentPageNote(pageNotes[currentPage]);
    } else {
      setCurrentPageNote('');
    }
  }, [currentPage, pageNotes]);

  const handleSavePageNote = () => {
    const updatedNotes = {
      ...pageNotes,
      [currentPage]: currentPageNote
    };
    setPageNotes(updatedNotes);
    localStorage.setItem(`submission_notes_${id}`, JSON.stringify(updatedNotes));
    toast.success(`Note saved for page ${currentPage}`);
  };

  const handleDeletePageNote = () => {
    const updatedNotes = { ...pageNotes };
    delete updatedNotes[currentPage];
    setPageNotes(updatedNotes);
    setCurrentPageNote('');
    localStorage.setItem(`submission_notes_${id}`, JSON.stringify(updatedNotes));
    toast.success(`Note deleted for page ${currentPage}`);
  };

  const mergeAllNotes = () => {
    const sortedPages = Object.keys(pageNotes).sort((a, b) => Number(a) - Number(b));
    let mergedNotes = '';

    sortedPages.forEach((page) => {
      if (pageNotes[page].trim()) {
        mergedNotes += `<strong>Page ${page}:</strong><br/>${pageNotes[page]}<br/><br/>`;
      }
    });

    return mergedNotes;
  };

  return {
    pageNotes,
    setPageNotes,
    currentPageNote,
    setCurrentPageNote,
    showNotesPanel,
    setShowNotesPanel,
    handleSavePageNote,
    handleDeletePageNote,
    mergeAllNotes
  };
}