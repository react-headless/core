import React from 'react';
import useMenu from './menu';
import useErrorBoundary from 'use-error-boundary';

const App = () => {
  const items = [
    {
      id: '1',
      text: 'item 1',
      items: [
        {
          id: 'subitem-1',
          text: 'Subitem 1'
        },
        {
          id: 'subitem-2',
          text: 'Subitem 2'
        }
      ]
    },
    { id: '2', text: 'item 2'},
    { id: '3', text: 'item 3'}
  ];

  
  return(
      <div>
        <UlElement items={items} />
      </div>
  );
}

const UlElement = React.memo(({ items = [] }) => {
  const { menuItems, totalItems, getMenuProps} = useMenu(items);

  const testArray = menuItems.map((item, index) => {
    if (item.items) {
      return (
        <React.Fragment key={`li-${item.id}`}>
          <LiElement item={item} text={item.text}>
            <UlElement items={item.items} />
          </LiElement>
        </React.Fragment>
      )
    }
    return (
    <LiElement key={`li-${item.id}`} item={item} >{item.text}</LiElement>
    );
  });
  return(
    <React.Fragment>
      <span>Total Items: {totalItems}</span>
      <ul {...getMenuProps()}>
        {testArray}
      </ul>
    </React.Fragment>
    
  )
});

const LiElement = React.memo(({ children, text, expanded, item}) => {
  const style = {};
  if (item.expanded) {
    style.border = '1px solid black';
  }
  return (
    <li {...item.getProps({style})}>
      {text}
      {children}
    </li>
  )
})
export default App;