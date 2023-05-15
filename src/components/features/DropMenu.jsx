import { useState } from "react"

export const DropMenu = () => {
  const [ isDisplayMenu, setIsDisplayMenu ] = useState(false);
  const handleToggleMenu = () => {
    setIsDisplayMenu(!isDisplayMenu);
  }
  return(
    <>
      <nav className='bg-neutral-800 text-white text-center'>
        <ul className='flex justify-center'>
          <li className='text-neutral-600 py-5 px-9 hover:text-white'>top</li>
          <li className='has-child text-neutral-600 relative py-5 px-9 cursor-pointer select-none hover:text-white' onClick={handleToggleMenu}>about ↓
            <ul className={`absolute left-0 top-16 bg-cyan-600 w-44 ${isDisplayMenu ? 'opacity-100 visivility': 'opacity-0 invisible'}`}>
              <li className='block py-2 px-9 text-white hover:opacity-50'>1</li>
              <li className='block py-2 px-9 text-white hover:opacity-50'>2</li>
            </ul>
          </li>
        </ul>
      </nav>
    </>
  )
}