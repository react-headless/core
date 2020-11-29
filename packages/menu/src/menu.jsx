import React from 'react';

function init({
  items,
  expanded = false,
  dispatch
}) {
  const itemMap = new Map();
  let flatItemMap = new Map();

  const onMenuItemMouseOver = (dispatch, id) => {
    dispatch({type: 'setActiveItem', id, active: true })
  };

  const onMenuItemClick = (dispatch) => {
    dispatch({type: 'toggleMenu'});
  };

  items.forEach((item) => {
    const { items, ...rest } = item;
    if (items) {
      const nestedItems = init({ items, expanded, dispatch });
      flatItemMap = new Map(...flatItemMap, nestedItems.items);
    }
    itemMap.set(item.id, {
      active: false,
      hover: false,
      ...item
    });
    flatItemMap.set(item.id, item);
  });
  return({
    items: itemMap,
    flatItems: flatItemMap,
    activeItem: null,
    expanded
  });
};
function reducer(state, action) {
  switch (action.type) {
    case 'setHoverItem':
      if (action.id) {
        const item = state.items.get(action.id);
        item.hover = action.hover;
      }
      return {...state, items: state.items};
    case 'setActiveItem':
      if (action.id) {
        const item = state.items.get(action.id);
        item.active = action.active;
      }
      return {...state, items: state.items, activeItem: action.id};
    case 'toggleMenu':
      return {...state, items: state.items, expanded: !state.expanded};
    case 'openMenu':
      return {...state, items: state.items, expanded: true};
    case 'closeMenu':
      return {...state, items: state.items, expanded: false};
    default:
      throw new Error();
  }
}

const useMenu = (...args) => {
  const [items] = args;
  const menuRef = React.useRef();
  
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

  const menuItems = React.useMemo(() => {

    const tempItems = [];
    for (const item of state.items.values()) {
      tempItems.push({
        id: item.id,
        items: item.items,
        text: item.text,
        setActive: (active) => dispatch({ type: 'setActiveId', id: item.id, active }),
        getProps: (props) => {
          return{
            role: 'menuitem',
            onPointerLeave: () => dispatch({ type: 'setHoverItem', id: item.id, hover: false }),
            onPointerOver: () => dispatch({ type: 'setHoverItem', id: item.id, hover: true }),
            onMouseOut: () => dispatch({type: 'setActiveItem', id: item.id, active: false}),
            onClick: () => dispatch({type: 'toggleMenu'}),
            onMouseOver: () => dispatch({type: 'setActiveItem', id: item.id, active: true }),
            ...props
          }
        },
      });
    }
    return tempItems;
  }, [state.items]);
  return{
    count: state.items.size,
    flattenedCount: state.flatItems.size,
    expanded: state.expanded,
    dispatch,
    getMenuProps,
    menuItems
  };
};

const useMenuItem = () => {

}

export default useMenu;