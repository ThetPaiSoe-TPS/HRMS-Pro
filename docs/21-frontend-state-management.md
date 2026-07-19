File 22: Frontend State Management
1. State Management Architecture
State Structure
typescript
// types/state.ts
export interface AppState {
    auth: AuthState;
    employees: EmployeeState;
    departments: DepartmentState;
    attendance: AttendanceState;
    leave: LeaveState;
    payroll: PayrollState;
    reports: ReportState;
    ui: UIState;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    permissions: string[];
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface EmployeeState {
    employees: Employee[];
    currentEmployee: Employee | null;
    loading: boolean;
    error: string | null;
    pagination: Pagination;
    filters: EmployeeFilters;
}
2. Redux Implementation
Store Configuration
typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './rootReducer';
import { apiMiddleware } from './middleware/api';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'ui'], // Only persist these
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }).concat(apiMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
Employee Slice
typescript
// features/employee/employeeSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/api';
import { Employee, EmployeeFilters, Pagination } from '../../types';

interface EmployeeState {
    employees: Employee[];
    currentEmployee: Employee | null;
    loading: boolean;
    error: string | null;
    pagination: Pagination;
    filters: EmployeeFilters;
}

const initialState: EmployeeState = {
    employees: [],
    currentEmployee: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
    },
    filters: {
        search: '',
        department_id: null,
        position_id: null,
        status: 'active',
    },
};

// Async thunks
export const fetchEmployees = createAsyncThunk(
    'employees/fetchAll',
    async (params: any, { rejectWithValue }) => {
        try {
            const response = await api.get('/employees', { params });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createEmployee = createAsyncThunk(
    'employees/create',
    async (data: Partial<Employee>, { rejectWithValue }) => {
        try {
            const response = await api.post('/employees', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'employees/update',
    async ({ id, data }: { id: number; data: Partial<Employee> }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/employees/${id}`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    'employees/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/employees/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<EmployeeFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 1; // Reset page when filters change
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.pagination.page = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        selectEmployee: (state, action: PayloadAction<number>) => {
            state.currentEmployee = state.employees.find(e => e.id === action.payload) || null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Employees
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload.data.employees;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Employee
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.employees.unshift(action.payload.data.employee);
                state.pagination.total += 1;
            })
            // Update Employee
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const index = state.employees.findIndex(
                    e => e.id === action.payload.data.employee.id
                );
                if (index !== -1) {
                    state.employees[index] = action.payload.data.employee;
                }
            })
            // Delete Employee
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.employees = state.employees.filter(e => e.id !== action.payload);
                state.pagination.total -= 1;
            });
    },
});

export const { setFilters, setPage, clearError, selectEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
3. React Query Implementation
Query Client Setup
typescript
// config/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 30 * 60 * 1000, // 30 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 1,
        },
    },
});

// Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/api';

export const employeeKeys = {
    all: ['employees'] as const,
    lists: () => [...employeeKeys.all, 'list'] as const,
    list: (filters: any) => [...employeeKeys.lists(), filters] as const,
    details: () => [...employeeKeys.all, 'detail'] as const,
    detail: (id: number) => [...employeeKeys.details(), id] as const,
};

export const useEmployees = (filters: any) => {
    return useQuery({
        queryKey: employeeKeys.list(filters),
        queryFn: () => api.get('/employees', { params: filters }).then(res => res.data),
    });
};

export const useEmployee = (id: number) => {
    return useQuery({
        queryKey: employeeKeys.detail(id),
        queryFn: () => api.get(`/employees/${id}`).then(res => res.data),
        enabled: !!id,
    });
};

export const useCreateEmployee = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => api.post('/employees', data).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
        },
    });
};
4. Custom Hooks
Employee Hooks
typescript
// hooks/useEmployees.ts
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import {
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setFilters,
    setPage,
} from '../features/employee/employeeSlice';
import { RootState, AppDispatch } from '../store';

export const useEmployees = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { employees, loading, error, pagination, filters } = useSelector(
        (state: RootState) => state.employees
    );

    const loadEmployees = useCallback(() => {
        dispatch(fetchEmployees({ ...filters, ...pagination }));
    }, [dispatch, filters, pagination]);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    const handleSearch = useCallback(
        (search: string) => {
            dispatch(setFilters({ search }));
        },
        [dispatch]
    );

    const handleFilterChange = useCallback(
        (newFilters: Partial<typeof filters>) => {
            dispatch(setFilters(newFilters));
        },
        [dispatch]
    );

    const handlePageChange = useCallback(
        (page: number) => {
            dispatch(setPage(page));
        },
        [dispatch]
    );

    const handleCreate = useCallback(
        async (data: any) => {
            const result = await dispatch(createEmployee(data));
            if (createEmployee.fulfilled.match(result)) {
                // Show success notification
                return result.payload;
            }
            // Show error notification
            return null;
        },
        [dispatch]
    );

    return {
        employees,
        loading,
        error,
        pagination,
        filters,
        loadEmployees,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        handleCreate,
    };
};