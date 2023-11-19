import { useContext, createContext, useState } from "react";

export interface PagesProviderInterface {
  children: React.ReactNode;
}

export type TPage = "allItems" | "addItem" | "editItem" | "allOrganizers" | "addOrganizer" | "editOrganizer";

export type TAddItemParams = {
  organizerId: string,
  position: number
};
export type TPageParams = { data: TAddItemParams | null };

export interface PagesContextInterface {
  currentPage: TPage;
  params?: TPageParams;
  setCurrentPage: (page: TPage, params?: TPageParams) => void;
}

export const PagesContext = createContext<PagesContextInterface>({
  currentPage: "allItems",
  setCurrentPage: () => { },
  params: undefined,
});

// eslint-disable-next-line react-refresh/only-export-components
export const usePages = () => useContext(PagesContext);

export const PagesProvider: React.FC<PagesProviderInterface> = ({ children }) => {
  const [currentPage, setCurrentPageState] = useState<TPage>("allItems");
  const [params, setParams] = useState<TPageParams>();

  const setCurrentPage = (page: TPage, params?: TPageParams) => {
    setCurrentPageState(page);
    setParams(params);
  };

  return (
    <PagesContext.Provider value={{ currentPage, setCurrentPage, params }}>
      {children}
    </PagesContext.Provider>
  );
};
