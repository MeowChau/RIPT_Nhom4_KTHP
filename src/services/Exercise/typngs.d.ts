declare namespace API {
  interface Exercise {
    _id: string;
    name: string;
    type: 'Kháng lực' | 'Cardio' | 'BodyCombat';
    image?: string;
    videoUrl: string;
    description: string;
    frequency: {
      sets: number;
      reps: number;
      rest: number; // Thời gian nghỉ (giây)
    };
    createdAt: string;
    updatedAt: string;
  }

  interface APIResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    count?: number;
  }
}

declare namespace Components {
  // Interface cho ExerciseList component
  interface ExerciseListProps {
    exercises: API.Exercise[];
    loading: boolean;
    onView: (id: string) => void;
    searchText?: string;
  }

  // Interface cho ExerciseCard component
  interface ExerciseCardProps {
    exercise: API.Exercise;
    onView: (id: string) => void;
  }

  // Interface cho SearchBar component
  interface SearchBarProps {
    onSearch: (value: string) => void;
    onFilter: (type: string) => void;
    types: string[];
  }

  // Interface cho ExerciseFilter component
  interface ExerciseFilterProps {
    types: string[];
    selectedType: string;
    onTypeChange: (type: string) => void;
  }

  // Interface cho ExerciseDetail component
  interface ExerciseDetailProps {
    exercise: API.Exercise | null;
    visible: boolean;
    onClose: () => void;
  }
}