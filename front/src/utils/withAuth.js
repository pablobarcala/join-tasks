// import { useEffect } from 'react';
// import { useAuthStore } from '../store/authStore';
// import { useRouter } from 'next/navigation';

// const withAuth = (Component) => {
//   return function Protected(props) {
//     const token = useAuthStore((state) => state.token);
//     const router = useRouter();

//     useEffect(() => {
//       if (!token) {
//         router.push('/login');
//       }
//     }, [token]);

//     return token ? <Component {...props} /> : null;
//   };
// };

// export default withAuth;
