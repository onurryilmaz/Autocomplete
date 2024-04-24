'use client';
import React, { useState, useEffect, useRef } from 'react';
import { getMethod } from '@/redux/apiMethod';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import useCustomDispatch from '@/hooks/useCustomDispatch';
import { CharacterSearchAction } from '@/redux/slices/characterSlice';
import Image from 'next/image';
import { Result } from '@/redux/slices/characterTypes';
import { FaXmark } from 'react-icons/fa6';

const Autocomplete = () => {
   //Redux
   const actionDispatch = useCustomDispatch();
   const { error: errorMessage } = useSelector((state: RootState) => state.characterSlice);
   const characters = useSelector((state: RootState) => state.characterSlice.characterSearch);
   //State
   const [loading, setLoading] = useState<boolean>(true);
   const [query, setQuery] = useState<string>('');
   const [selectedItem, setSelectedItem] = useState<number>(0);
   const [selectedCharacters, setSelectedCharacters] = useState<Result[]>([]);
   const [isOpen, setIsOpen] = useState(false);
   const contentRef = useRef<HTMLDivElement>(null);

   //Api Search
   let timeoutId: NodeJS.Timeout;
   const requestInput = () => {
      clearTimeout(timeoutId);
      setLoading(true);
      //Redux action and fetch
      timeoutId = setTimeout(async () => {
         await actionDispatch(getMethod, `/?name=${query}`, CharacterSearchAction);
         setLoading(false);
      }, 500); // Send request after 500ms
   };

   useEffect(() => {
      requestInput();
      return () => {
         clearTimeout(timeoutId);
      };
   }, [query]);

   //Input Search Event
   const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setQuery(value);
      setSelectedItem(0);
   };

   //Search Bold Text
   const boldSearch = (name: any) => {
      const parts = name.split(new RegExp(`(${query})`, 'gi'));
      return (
         <span>
            {parts.map((part: any, index: number) =>
               part.toLowerCase() === query.toLowerCase() ? <strong key={index}>{part}</strong> : part
            )}
         </span>
      );
   };
   //Key Event
   const handleKeyDown = (
      event: React.KeyboardEvent<HTMLLIElement> | React.KeyboardEvent<HTMLInputElement> | KeyboardEvent
   ) => {
      let charactersLeng = characters.results ? characters.results.length : 0;
      if (characters && characters.results) {
         if (event.key === 'ArrowUp') {
            setSelectedItem((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
            scrollDownUp();
         } else if (event.key === 'ArrowDown') {
            setSelectedItem((prevIndex) => (prevIndex < charactersLeng - 1 ? prevIndex + 1 : prevIndex));
            scrollDownUp();
         } else if (event.key === 'Tab') {
            setSelectedItem((prevIndex) => (prevIndex < charactersLeng - 1 ? prevIndex + 1 : 0));
            scrollDownUp();
            event.preventDefault();
         } else if (event.key === 'Enter') {
            handleCheckboxChange(characters.results[selectedItem]);
            event.preventDefault();
         }
      }
   };

   const scrollDownUp = () => {
      const selected = document.querySelector('.selected');
      selected?.scrollIntoView({
         block: 'center',
         inline: 'center',
      });
   };

   useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);

      return () => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, [characters.results, selectedItem]);

   //Click Event
   const handleItemClick = (index: number, item: Result) => {
      setSelectedItem(index);
      //Check input when clicked
      handleCheckboxChange(item);
   };
   //Add and Delete Characters
   const handleCheckboxChange = (item: Result) => {
      // Search the string selectedCharacters
      const searchSelected = selectedCharacters.findIndex((find) => find.id === item.id);
      // If the object exists, remove it from the list
      if (searchSelected !== -1) {
         const newItems = [...selectedCharacters];
         newItems.splice(searchSelected, 1);
         setSelectedCharacters(newItems);
      } else {
         // If not in the list, add it to the list
         setSelectedCharacters([...selectedCharacters, item]);
      }
   };

   //Open close popup

   const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
         setIsOpen(false);
      }
   };

   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   return (
      <div className="autocomplete-component">
         <div
            className="autocomplete-box"
            ref={contentRef}
         >
            <div className="search-box">
               {selectedCharacters &&
                  selectedCharacters.map((item) => {
                     return (
                        <div
                           className="section-characters"
                           key={item.id}
                        >
                           <span>{item.name}</span>
                           <span
                              className="close-button"
                              onClick={() => handleCheckboxChange(item)}
                           >
                              <FaXmark />
                           </span>
                        </div>
                     );
                  })}
               <input
                  type="text"
                  className="autocomplete-text-input"
                  onChange={handleInputChange}
                  placeholder="Search..."
                  onClick={() => setIsOpen(true)}
               />
            </div>
            {isOpen && (
               <div className="characters-container">
                  {!loading ? (
                     <ul>
                        {characters.results ? (
                           characters.results.map((item, index) => {
                              return (
                                 <li
                                    key={item.id}
                                    className={index === selectedItem ? 'selected' : ''}
                                    onClick={() => handleItemClick(index, item)}
                                    onKeyDown={(e) => handleKeyDown(e)}
                                 >
                                    <div className="cc-box">
                                       <div className="checkBox">
                                          <label>
                                             <input
                                                type="checkbox"
                                                name={item.id.toString()}
                                                checked={selectedCharacters.some((find) => find.id === item.id)}
                                                onChange={() => handleCheckboxChange(item)}
                                             />
                                          </label>
                                       </div>
                                       <div className="images">
                                          <Image
                                             src={item.image}
                                             width={50}
                                             height={50}
                                             alt={item.name}
                                             priority
                                          />
                                       </div>
                                       <div className="text-box">
                                          <div className="name">{boldSearch(item.name)}</div>
                                          <div className="episode">{item.episode.length} Episodes</div>
                                       </div>
                                    </div>
                                 </li>
                              );
                           })
                        ) : (
                           <li>
                              <div className="alert-msg">{errorMessage}</div>
                           </li>
                        )}
                     </ul>
                  ) : (
                     <div className="loader-content">
                        <div className="loader"></div>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );
};

export default Autocomplete;
