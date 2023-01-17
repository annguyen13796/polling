- Function Name           : VERB
- Variable Name           : NOUN
- Boolean Variable Name   : Start with "is" or "has"


- File Naming Style       : ke-bab."type".ts
Ex: 
    add-address.dto.ts
    auth.controller.ts

- Function Naming Style     : cammelCase
Ex: 
    function addAddress(){}

- Class Naming Style        : PasCal
Ex: 
    class AddAddressUseCaseInput {}

- Interface (TypeScript) Naming Style    : PasCal
Ex: 
    interface AddressProps {
        street: string | null | undefined;
    }

- Attributes Naming Odrder : Folow alphabet order
Ex: 
    const object= {
        age : 19, 
        family : "home",
        name : "Object",
    }


- If Statement Declaration      : Always make curly brace instead of inline-code 
Ex: 
    If (isValid){
        //dosth
    }

- Export Import Convention      : Every folder should have index.ts file 

- "Follow Commitizen Convention when commiting"

- No Console when commit
- Comment with /* */ instead of //
- Use git precommit/prepush with husky


PRETIER
- Tab with =  2 
- Comma Trailing = True 

TESTING CONVENTION
1) Arrange 
2) Act
3) Assert


GIT FLOW