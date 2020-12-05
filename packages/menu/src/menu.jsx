import React from 'react';

const init = ([
  items,
  expanded = false
]) => {
  const itemMap = new Map();
  let flatItemMap = new Map();

  items.forEach((item) => {
    const { items, ...rest } = item;
    if (items) {
      const nestedItems = init([items, expanded]);
      nestedItems.items.forEach(nestedItem => {
        flatItemMap.set(nestedItem.id, nestedItem);
      });
      itemMap.set(item.id, {
        active: false,
        hover: false,
        expanded: false,
        ...rest,
        items: new Map(nestedItems.items)
      });
      flatItemMap.set(item.id, itemMap.get(item.id));
    } else {
      itemMap.set(item.id, {
        active: false,
        hover: false,
        expanded: false,
        ...rest
      });
      flatItemMap.set(item.id, itemMap.get(item.id));
    }
  });
  return({
    items: itemMap,
    flatItems: flatItemMap,
    hoverItems: new Set(),
    activeItems: new Set(),
    expandedItems: new Set(),
  });
};
function reducer(state, action) {
  switch (action.type) {
    case 'setHoverItem': {
      if (action.hasOwnProperty('id') && state.flatItems.has(action.id)) {
        const { items, flatItems, hoverItems, ...rest } = state;
        const item = flatItems.get(action.id);
        item.hover = action.hover;
        items.set(action.id, item);
        if (action.hover === false) {
          hoverItems.delete(action.id);
        } else {
          hoverItems.add(action.id);
        }
        return {...rest, items, flatItems, hoverItems};
      }
      throw new Error(`Invalid id ${action.id} passed to setHoverItem.`)
      return {...state}
    }
    case 'resetActiveItems': {
      if (state.activeItems.size > 0) {
        const { items, flatItems, activeItems, ...rest } = state;
        flatItems.forEach((item) => {
          item.active = false;
          items.set(item.id, item);
        });
        activeItems.clear();
        return {
          ...rest, items, flatItems, activeItems
        }
      }
      return {...state}
    }
    case 'setActiveItem': {
      if (action.hasOwnProperty('id') && state.flatItems.has(action.id)) {
        const { items, flatItems, activeItems, ...rest } = state;
        const item = flatItems.get(action.id);
        item.active = action.active;
        items.set(action.id, item);
        if (action.active === false) {
          activeItems.delete(action.id);
        } else {
          activeItems.add(action.id);
        }
        return {...rest, items, flatItems, activeItems};
      }
      throw new Error(`Invalid id ${action.id} passed to setActiveItem.`)
      return {...state}
    }
    case 'setExpandedItem': {
      if (action.hasOwnProperty('id') && state.flatItems.has(action.id)) {
        const { items, flatItems, expandedItems, ...rest } = state;
        const item = flatItems.get(action.id);
        item.expanded = action.expanded;
        items.set(action.id, item);
        if (action.expanded === false) {
          expandedItems.delete(action.id);
        } else {
          expandedItems.add(action.id);
        }
        return {...rest, items, flatItems, expandedItems};
      }
      throw new Error(`Invalid id ${action.id} passed to setExpandedItem.`)
      return {...state}
    }
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
  const menuRef = React.useRef();
  
  const [state, dispatch] = React.useReducer(reducer, args, init);
  const getMenuProps = React.useCallback(() => {
    return {
      ref: menuRef,
      role: 'menu'
    };
  }, [menuRef]);

  const openMenu = React.useCallback(() => dispatch({ type: 'openMenu' }), []);
  const closeMenu = React.useCallback(() => dispatch({ type: 'closeMenu' }), []);
  const toggleMenu = React.useCallback(() => dispatch({ type: 'toggleMenu' }), []);

  const getExpandedItems = React.useCallback(() => Array.from(state.expandedItems.values()), [state.expandedItems]);
  const getActiveItems = React.useCallback(() => Array.from(state.activeItems.values()), [state.activeItems]);

  const getHoverItems = React.useCallback(() => Array.from(state.hoverItems.values()), [state.hoverItems]);

  const getMenuItems = React.useCallback((ittr) => {

    const tempItems = [];
    for (const item of ittr) {
      tempItems.push({
        id: item.id,
        items: item.items ? getMenuItems(item.items.values()) : null,
        text: item.text,
        active: item.active,
        hover: item.hover,
        expanded: item.expanded,
        openMenu,
        closeMenu,
        toggleMenu,
        setActive: (active) => dispatch({ type: 'setActiveId', id: item.id, active }),
        getProps: (props) => {
          return{
            role: 'menuitem',
            onPointerLeave: () => dispatch({ type: 'setHoverItem', id: item.id, hover: false }),
            onPointerOver: () => dispatch({ type: 'setHoverItem', id: item.id, hover: true }),
            onMouseOut: () => dispatch({type: 'resetActiveItems'}),
            onClick: () => dispatch({type: 'setExpandedItem', id: item.id, expanded: !item.expanded }),
            onMouseOver: () => dispatch({type: 'setActiveItem', id: item.id, active: true }),
            ...props
          }
        },
      });
    }
    return tempItems;
  }, [openMenu, closeMenu, toggleMenu]);
  const menuItems = getMenuItems(state.items.values());

  return{
    dispatch,
    getMenuProps,
    getExpandedItems,
    getActiveItems,
    getHoverItems,
    openMenu,
    closeMenu,
    toggleMenu,
    menuItems,
    totalItems: state.flatItems.size
  };
};

const useMenuItem = () => {

}

export default useMenu;