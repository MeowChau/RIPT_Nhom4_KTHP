import React, { useState} from 'react';

const ExerciseForm: React.FC<any> = ({isEditMode}) => {
  const [subcategories] = useState<string[]>([]);  // Mảng chứa các mục con
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null); // State lưu bài tập được chọn
  

  // Hàm xử lý khi click vào bài tập
  const handleExerciseClick = (exercise: string) => {
    setSelectedExercise(exercise);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {subcategories.map((subcategory, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="flex justify-between items-center">
              <span>{subcategory}</span>
              <button
                onClick={() => handleExerciseClick(subcategory)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xem
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedExercise && (
        <div className="mt-4 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Chi tiết bài tập: {selectedExercise}</h3>
          {/* Thêm nội dung chi tiết bài tập ở đây */}
          <p>Mô tả bài tập...</p>
          <p>Hướng dẫn thực hiện...</p>
          <p>Lưu ý khi tập...</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseForm;
