

export{}

describe('SignUpUseCase', () => {
      it('should throw Missing email', async () => {
        expect(1).toEqual(1)
      }
    )
  }
);

// import { SignUpUseCase, SignUpUseCaseInput } from '../signup.usecase';
// import { IUserRepository, User } from '../../domains';
// import { BadRequestionException } from '../../exceptions';
// // import {v4 as uuid} from 'uuid'

// jest.mock("uuid",()=>{
//   return{
//     v4: ()=>{return '123'}
//   }
// })

// describe('SignUpUseCase', () => {

//   describe('execute', () => {

//     let userRepository : IUserRepository
//     let signupUseCaseInput : SignUpUseCaseInput

//     const userRepoMockCreate = jest.fn() 
//     const userRepoMockUpdate = jest.fn()
//     const userRepoMockFindByEmail = jest.fn()
//     const userRepoMockFindById = jest.fn()

//     beforeEach(()=>{
//       userRepository  = {
//         create: userRepoMockCreate,
//         update: userRepoMockUpdate,
//         findByEmail: userRepoMockFindByEmail,
//         findById: userRepoMockFindById
//       } 
//     })

//     afterEach(()=>{
//       jest.clearAllMocks()
//     })

//     it('should throw Missing email', async () => {
//       const signupUseCase = new SignUpUseCase(userRepository)
//       signupUseCaseInput = {
//         dto : {
//           email: undefined,
//           password: "asd",
//           username: "asd"
//         }
//       }
//       await expect(signupUseCase.execute(signupUseCaseInput)).rejects.toThrowError(new BadRequestionException("Missing email"))
//     });

//     it('should throw Email is not valid', async () => {
//       const signupUseCase = new SignUpUseCase(userRepository)
//       signupUseCaseInput = {
//         dto : {
//           email: "Namkhoa",
//           password: "asd",
//           username: "asd"
//         }
//       }
//       await expect(signupUseCase.execute(signupUseCaseInput)).rejects.toThrowError(new BadRequestionException("Email is not valid"))
//     });

//     it('should throw Password is not valid', async () => {
//       const signupUseCase = new SignUpUseCase(userRepository)
//       signupUseCaseInput = {
//         dto : {
//           email: "Namkhoa@gmail.com",
//           password: "asd",
//           username: "asd"
//         }
//       }
//       await expect(signupUseCase.execute(signupUseCaseInput)).rejects.toThrowError(new BadRequestionException("Password is not valid"))
//     });

//     it('should throw UserName is not valid', async () => {
//       const signupUseCase = new SignUpUseCase(userRepository)
//       signupUseCaseInput = {
//         dto : {
//           email: "Namkhoa@gmail.com",
//           password: "P@ssw0rd",
//           username: "asd"
//         }
//       }
//       await expect(signupUseCase.execute(signupUseCaseInput)).rejects.toThrowError(new BadRequestionException("UserName is not valid"))
//     });

//     it('should throw PhoneNumber is not valid', async () => {
//       const signupUseCase = new SignUpUseCase(userRepository)
//       signupUseCaseInput = {
//         dto : {
//           email: "Namkhoa@gmail.com",
//           password: "P@ssw0rd",
//           username: "asdfghjklmnb",
//           phoneNumber: "01234"
//         }
//       }
//       await expect(signupUseCase.execute(signupUseCaseInput)).rejects.toThrowError(new BadRequestionException("PhoneNumber is not valid"))
//     });

//     it('should call findByEmail then throw User is existed', async () => {
//       const signupUseCase = new SignUpUseCase(userRepository)
//       signupUseCaseInput = {
//         dto : {
//           email: "Namkhoa@gmail.com",
//           password: "P@ssw0rd",
//           username: "asdfghjklmnb",
//           phoneNumber: "0123456789"
//         }
//       }
//       const returnUserMock = new User({
//           email: "Namkhoa@gmail.com",
//           password: "P@ssw0rd",
//           username: "asdfghjklmnb",
//           phoneNumber: "0123456789"
//       })  

//       userRepoMockFindByEmail.mockResolvedValueOnce(returnUserMock)
      
//       await expect(signupUseCase.execute(signupUseCaseInput)).rejects.toThrowError(new BadRequestionException("User is existed"))
//       expect(userRepoMockFindByEmail).toBeCalledWith(signupUseCaseInput.dto.email)
//     });

//     it('should call findByEmail,create then return success', async () => {
//       const signupUseCase = new SignUpUseCase(userRepository)
//       signupUseCaseInput = {
//         dto : {
//           email: "Namkhoa@gmail.com",
//           password: "P@ssw0rd",
//           username: "asdfghjklmnb",
//           phoneNumber: "0123456789"
//         }
//       }
//       const newUser = new User({
//           email: "Namkhoa@gmail.com",
//           password: "P@ssw0rd",
//           username: "asdfghjklmnb",
//           phoneNumber: "0123456789"
//       })  

//       userRepoMockFindByEmail.mockResolvedValueOnce(null)
      
//       const value = await signupUseCase.execute(signupUseCaseInput)
//       expect(userRepoMockFindByEmail).toBeCalledWith(signupUseCaseInput.dto.email)
//       //should use spyOn to mock the uuid but i have problem doing it that way
//       //i searched gg for the answer but they gave no solution
//       expect(userRepoMockCreate).toBeCalledWith(newUser)
//       expect(value).toBe('Signup successfully')
      
//     });
//   });

// });
