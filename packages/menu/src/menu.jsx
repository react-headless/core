import React from 'react';

function init({
  items,
  expanded = false
}) {
  console.log(items);
  return({
    items: new Set(items),
    expanded
  });
};
function reducer(state, action) {
  switch (action.type) {
    case 'toggleMenu':
      return {...state, expanded: !state.expanded};
    case 'openMenu':
      return {...state, expanded: true};
    case 'closeMenu':
      return {...state, expanded: false};
    default:
      throw new Error();
  }
}

const useMenu = (...args) => {
  const [items] = args;
  items.forEach(item => {
    if (item.items) {
      useMenu(item.items);
    }
  })
  const menuRef = React.useRef();
  const itemsRef = React.useRef(items);
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  const memoArgs = React.useMemo(() => {
    return{ items }
  }, [args]);
  const [state, dispatch] = React.useReducer(reducer, memoArgs, init);

  const getMenuProps = React.useCallback(() => {
    return {
      ref: menuRef,
      role: 'menu'
    };
  }, [menuRef]);

  const onMenuItemClick = React.useCallback(() => {
    dispatch({type: 'toggleMenu'});
  }, []);
  const getMenuItemProps = React.useCallback((props) => {
    return {
      role: 'menuitem',
      onClick: onMenuItemClick,
      ...props
    };
  }, [onMenuItemClick]);
  const menuItems = React.useMemo(() => {
    return Array.from(state.items.values());
  }, [state]);
  return {
    expanded: state.expanded,
    dispatch,
    getMenuProps,
    menuItems,
    getMenuItemProps
  };
};

export default useMenu;