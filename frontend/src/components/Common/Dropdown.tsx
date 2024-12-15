import { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

type DropdownProps = {
  title: string,
  titleClassName: string,
  elements: any,
  icon: any,
}

const Dropdown = (props: DropdownProps) => {
  return (
    <Menu as="div" className="flex flex-wrap items-center justify-center relative">
      <MenuButton
        className="flex text-blue-800 hover:bg-gray-50 items-center font-bold py-1 px-2 mx-2 my-1 rounded-md focus:outline-none focus:shadow-outline transition"
        type="button"
      >
        {props.icon}
        <span className={`${props.titleClassName}`}>{props.title}</span>
      </MenuButton>

      <MenuItems
        anchor={{ to: 'bottom end', gap: '4px' }}
        className="border border-gray-200 w-44 bg-white divide-y divide-gray-100 rounded-md shadow-sm py-2 text-sm text-gray-700"
      >
        {props.elements.map((e: any) => {
          return <MenuItem key={e.name}>
            <button
              key={e.name}
              className="w-full text-left px-4 py-1 hover:bg-gray-100"
              onClick={e.action}
            >
              {e.name}
            </button>
          </MenuItem>
        })}
      </MenuItems>
    </Menu>
  )
}
export default Dropdown
