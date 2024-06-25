import { useCallback, useEffect, useState } from 'react';
import SettingsContext from 'src/settings';

export const useSelection = (items = []) => {

  function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected(SettingsContext.SelectedBots);
  }, [items]);

  const handleSelectAll = useCallback(() => {
    setSelected([...items]);
    SettingsContext.SelectedBots = [...items]
    console.log(SettingsContext.SelectedBots)
  }, [items]);

  const handleSelectOne = useCallback((item) => {
    setSelected((prevState) => [...prevState, item]);
    SettingsContext.SelectedBots.push(item);
    console.log(SettingsContext.SelectedBots)
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelected([]);
    SettingsContext.SelectedBots = [];
    console.log(SettingsContext.SelectedBots)
  }, []);

  const handleDeselectOne = useCallback((item) => {
    setSelected((prevState) => {
      removeItemAll(SettingsContext.SelectedBots, item)
      console.log(SettingsContext.SelectedBots)
      return prevState.filter((_item) => _item !== item);
    });
  }, []);

  return {
    handleDeselectAll,
    handleDeselectOne,
    handleSelectAll,
    handleSelectOne,
    selected
  };
};
