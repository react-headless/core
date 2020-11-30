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
  const { expanded, menuItems, getMenuProps} = useMenu(items);

  
  return(
      <div>
        <UlElement getMenuProps={getMenuProps} expanded={expanded} items={menuItems} />
      </div>
  );
}

const UlElement = ({ getMenuProps, expanded, items = [] }) => {
  const testArray = items.map((item, index) => {
    if (item.items) {
      return (
        <React.Fragment key={`li-${item.id}`}>
          <LiElement expanded={expanded} item={item} text={item.text}>
            <UlElement items={item.items} expanded={expanded} getMenuProps={getMenuProps} />
          </LiElement>
        </React.Fragment>
      )
    }
    return (
    <LiElement key={`li-${item.id}`} expanded={expanded} item={item} >{item.text}</LiElement>
    );
  });
  return(
    <ul {...getMenuProps()}>
      {testArray}
    </ul>
  )
};

const LiElement = ({ children, text, expanded, item}) => {
  return item.id === 1 && expanded ? (
    <li {...item.getProps()}>
      foo
      {children}
    </li>
    ) : (
    <li {...item.getProps()}>
      {text}
      {children}
    </li>
  )
}
export default App;