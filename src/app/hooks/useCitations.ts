import { useRef, useState } from 'react';

export const useCitations = () => {
  const [activeReference, setActiveReference] = useState<number | null>(null);
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleCitationClick = (id: number) => {
    setActiveReference(id);
    resultRefs.current[id - 1]?.scrollIntoView({ behavior: 'smooth' });
    
    resultRefs.current[id - 1]?.classList.add('flash');
    setTimeout(() => {
      resultRefs.current[id - 1]?.classList.remove('flash');
    }, 1000);
  };

  const resetActiveReference = () => {
    setActiveReference(null);
  };

  return {
    activeReference,
    resultRefs,
    handleCitationClick,
    resetActiveReference,
  };
};