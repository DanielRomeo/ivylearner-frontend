'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import DashboardLayout from './_components/DashboardLayout';
import StudentDashboard from './_components/StudentDashboard';
import InstructorDashboard from './_components/InstructorDashboard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [userRole, setUserRole] = useState<'student' | 'instructor'>('student');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/signin');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        // TODO: Fetch user role from API
        // For now, default to student
        setUserRole('instructor');
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <DashboardLayout userRole={userRole}>
            {userRole === 'student' ? (
                <StudentDashboard />
            ) : (
                <InstructorDashboard />
            )}
        </DashboardLayout>
    );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import StudentDashboard from './_components/StudentDashboard';
// import InstructorDashboard from './_components/InstructorDashboard';

// export default function DashboardPage() {
//     const [userRole] = useState<'student' | 'instructor'>('student');
    
//     return userRole === 'student' ? (
//         <StudentDashboard />
//     ) : (
//         <InstructorDashboard />
//     );
// }