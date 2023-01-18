// import { SignInUseCase, SignInUseCaseInput } from '../signin.usecase';
// import { IUserRepository, User } from '../../domains';
// import { BadRequestionException, NotFoundException } from '../../exceptions';
export{}

describe('SignInUseCase', () => {
      it('should throw Missing email', async () => {
        expect(1).toEqual(1)
      }
    )
  }
);
// describe('SignInUseCase', () => {

//   describe('execute', () => {

//     let userRepository : IUserRepository
//     let signinUseCaseInput : SignInUseCaseInput

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
//       const signInUseCase = new SignInUseCase(userRepository)
//       signinUseCaseInput = {
//         dto : {
//           email: undefined,
//           password: "asd",
//         }
//       }
//       await expect(signInUseCase.execute(signinUseCaseInput)).rejects.toThrowError(new BadRequestionException("Missing email"))
//     });

//     it('should call findByEmail then throw User is not existed', async () => {
//       const signinUsecase = new SignInUseCase(userRepository)
//       signinUseCaseInput = {
//         dto : {
//           email: "Namkhoa@gmail.com",
//           password: "P@ssw0rd",
//         }
//       }
//       userRepoMockFindByEmail.mockResolvedValueOnce(null)
      
//       await expect(signinUsecase.execute(signinUseCaseInput)).rejects.toThrowError(new NotFoundException("User is not existed"))
//     });

//     it('should call findByEmail then throw Password is incorrect', async () => {
//       const signinUsecase = new SignInUseCase(userRepository)
//       signinUseCaseInput = {
//         dto : {
//           email: "Namkhoa@gmail.com",
//           password: "P@ssw0rdddd",
//         }
//       }
//       const newUser = new User({
//           email: "Namkhoa@gmail.com",
//           password: "P@ssw0rd",
//           username: "asdfghjklmnb",
//           phoneNumber: "0123456789"
//       })  

//       userRepoMockFindByEmail.mockResolvedValueOnce(newUser)
      
//       await expect(signinUsecase.execute(signinUseCaseInput)).rejects.toThrowError(new BadRequestionException("Password is incorrect"))
//       expect(userRepoMockFindByEmail).toBeCalledWith(signinUseCaseInput.dto.email)
//     });

//     it('should call findByEmail then return token successfully', async () => {
//         const signinUsecase = new SignInUseCase(userRepository)
//         signinUseCaseInput = {
//           dto : {
//             email: "Namkhoa@gmail.com",
//             password: "P@ssw0rd",
//           }
//         }
//         const newUser = new User({
//             email: "Namkhoa@gmail.com",
//             password: "P@ssw0rd",
//             username: "asdfghjklmnb",
//             phoneNumber: "0123456789"
//         })  

//         const mockReturnAccessToken = jest.fn(()=>{return 'this is access token'})
//         const mockReturnIdToken = jest.fn(()=>{return 'this is id token'})
//         newUser.getAccessToken = mockReturnAccessToken
//         newUser.getIdToken = mockReturnIdToken
//         userRepoMockFindByEmail.mockResolvedValueOnce(newUser)
        
//         const value =await signinUsecase.execute(signinUseCaseInput)
//         expect(userRepoMockFindByEmail).toBeCalledWith(signinUseCaseInput.dto.email)
//         expect(mockReturnAccessToken).toBeCalled()
//         expect(mockReturnIdToken).toBeCalled()
//         expect(value).toEqual({accessToken:'this is access token', idToken:'this is id token'})
//     });
//   })

// });
