# CODING CONVENTION

## Coding style and convention
### 1) Function
- Function name is a VERB 
- Function naming style : camelCase  
Ex:
```javascript
  const addUserName = ()=>{
    console.log("Welcome to my page")
  };
```
### 2) Variable
- Variable name is a NOUN  
Ex:
```javascript
  const numberOfTasks = 100;
```
- Boolean Variable name starts with "is" or "has"  
Ex:
```javascript
  let isInvalid = false;
```
### 3) File
- File Naming Style : ke-bab."type".ts  
Ex:
```javascript
  add-address.dto.ts
  auth.controller.ts
```
### 4) Class, Interface and Object
- Class Naming Style : PasCal  
Ex:
```javascript
  class AddAddressUseCaseInput {

  }
```
- Interface (TypeScript) Naming Style : PasCal  
Ex:
```typescript
  interface AddressProps {
    street: string | null | undefined;
  }
```
- Object' attributes naming order : Follow alphabet order  
Ex:
```typescript
  const object= {
    age : 19,
    family : "home",
    name : "Object",
  }
```
### 5) Logic Statement
- If Statement Declaration : Always make curly brace instead of inline-code  
Ex:
```typescript
  if (isValid){
  //do sth
  }
```
---
## Git Note
  - Use Git Flow
  - "Follow Commitizen Convention when committing"
  - No console.log when commit
  - Use git pre-commit/pre-push with husky

---
## Some Extra Note
  - Export Import Convention : Every folder should have index.ts file

  - Comment  
  ```typescript
  /* */ instead of //  
  ```
---
## Rules for Eslint and Prettier
### Eslint
```json
{
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier"
	],
	"overrides": [],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": ["react", "@typescript-eslint"],
	"rules": {
		"@typescript-eslint/interface-name-prefix": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/no-explicit-any": "off"
	}
}
```
### Prettier
```json
{
	"tabWidth": 2,
	"useTabs": true,
	"semi": true,
	"trailingComma": "all"
}  
```
---
## Testing Convention
  1. Arrange
  2. Act
  3. Assert
---
## Reference
https://google.github.io/styleguide/tsguide.html





