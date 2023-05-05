import { createContext, useState } from 'react';

export const AppContext = createContext(null);

function Context({children}) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState();
  return (
    <AppContext.Provider value={{user, setUser, role, setRole}}>
        {children}
    </AppContext.Provider>
    )
}

export default Context;