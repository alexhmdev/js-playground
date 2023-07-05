import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
const useTabsStore = create(
  persist(
    (set, get) => ({
      tabs: [
        {
          id: uuidv4(),
          name: 'index.js',
          code: '// start typing some code... \n',
          codeResult: '',
          active: true,
        },
      ],
      activeTab: 0,
      addTab: () =>
        set({
          tabs: [
            ...get().tabs.map((tab) => {
              return {
                ...tab,
                active: false,
              };
            }),
            {
              id: uuidv4(),
              name: `Untitled-${get().tabs.length + 1}`,
              code: '// start typing some code... \n',
              codeResult: '',
              active: true,
            },
          ],
          activeTab: get().tabs.length,
        }),
      removeTab: (id) =>
        set({
          tabs: get().tabs.filter((tab) => tab.id !== id),
          activeTab: get().tabs.length - 2,
        }),
      setActiveTab: (id) =>
        set({
          tabs: get().tabs.map((tab) => {
            return {
              ...tab,
              active: tab.id === id ? true : false,
            };
          }),
          activeTab: get().tabs.findIndex((tab) => tab.id === id),
        }),
      setTabName: (id, name) =>
        set({
          tabs: get().tabs.map((tab) => {
            return {
              ...tab,
              name: tab.id === id ? name : tab.name,
            };
          }),
        }),
      setTabCode: (id, code) =>
        set({
          tabs: get().tabs.map((tab) => {
            return {
              ...tab,
              code: tab.id === id ? code : tab.code,
            };
          }),
        }),
      setTabCodeResult: (id, codeResult) =>
        set({
          tabs: get().tabs.map((tab) => {
            return {
              ...tab,
              codeResult:
                tab.id === id ? tab.codeResult + codeResult : tab.codeResult,
            };
          }),
        }),
      clearTabCodeResult: (id) =>
        set({
          tabs: get().tabs.map((tab) => {
            return {
              ...tab,
              codeResult: tab.id === id ? '' : tab.codeResult,
            };
          }),
        }),
    }),
    {
      name: 'tabs-store',
    }
  )
);

export default useTabsStore;
