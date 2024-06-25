import React, { useState, useRef } from 'react';
import { TextField, Chip, Button } from '@mui/material';
import SettingsContext from 'src/settings';

const TagInput = ({ refresh })  => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
        const newTags = inputValue.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        if (newTags.length > 0) {
            setTags([...tags, ...newTags]);
        }
      setInputValue('');
      SettingsContext.FindByBank = [...tags, inputValue.trim()].join(",");
      console.log("updated tags: " + SettingsContext.FindByBank)
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace' && inputValue === '') {
      event.preventDefault();
      if (tags.length > 0) {
        const newTags = [...tags];
        const lastTag = newTags.pop();
        setTags(newTags);
        setInputValue(lastTag);
        inputRef.current.focus();
        SettingsContext.FindByBank = newTags;
        console.log("updated tags: " + SettingsContext.FindByBank)
      }
    }
  };

  const handleTagDelete = (tagToDelete) => () => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
    inputRef.current.focus();
    SettingsContext.FindByBank = tags.filter((tag) => tag !== tagToDelete)
    console.log("updated tags: " + SettingsContext.FindByBank)
  };

  return (
    <div>
        <div style={{ display: 'flex', alignItems: 'center'}}>
      <TextField
        label="App"
        variant="outlined"
        fullWidth
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
        onKeyDown={handleKeyDown}
        InputProps={{
          style: {
            width: 250,
            overflow: 'hidden',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
          },
          startAdornment: tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              variant="outlined"
              onDelete={handleTagDelete(tag)}
              className={index === 0 ? 'first-chip' : ''}
              style={{ margin: '4px' }}
            />
          )),
        }}
        inputProps={{
          style: {
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            minHeight: 'auto', // Reset minHeight to auto
          },
          ref: inputRef,
        }}
      />
        <Button variant="contained" color="primary" onClick={refresh} style={{ marginLeft: '8px' }}>
          Apply
        </Button>
        </div>
    </div>
  );
};

export default TagInput;
