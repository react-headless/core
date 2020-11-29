import React from 'react';
import useMenu from './menu';
import useErrorBoundary from 'use-error-boundary';

const App = () => {
  const items = [
    {
      id: 1,
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
    { id: 2, text: 'item 2'},
    { id: 3, text: 'item 3'}
  ];
  
  return(
      <div>
        <UlElement items={items} />
      </div>
  );
}

const UlElement = React.memo(({ items }) => {
  const { expanded, menuItems, getMenuProps, getMenuItemProps } = useMenu(items);

  return(
    <ul {...getMenuProps()}>
      { menuItems.map((item, index) => {
        if (item.items) {
          return (
            <React.Fragment key={`li-${item.id}`}>
              <LiElement expanded={expanded} item={item} getMenuItemProps={getMenuItemProps} text={item.text}>
                <UlElement items={item.items} />
              </LiElement>
            </React.Fragment>
          )
        }
        return (
        <LiElement key={`li-${item.id}`} expanded={expanded} item={item} getMenuItemProps={getMenuItemProps}>{item.text}</LiElement>
        );
      })}
    </ul>
  )
});

const LiElement = React.memo(({ children, text, expanded, item, getMenuItemProps }) => {
  return item.id === 1 && expanded ? (
    <li {...getMenuItemProps()}>
      foo
      {children}
    </li>
    ) : (
    <li {...getMenuItemProps()}>
      {text}
      {children}
    </li>
  )
})
export default App;