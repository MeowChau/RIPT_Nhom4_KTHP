import { useState } from "react"; // Import useState để quản lý trạng thái của component
import { Button, Input, message as antdMessage } from "antd"; // Import Button, Input từ Ant Design, và đổi tên message thành antdMessage để hiển thị thông báo

const GuessNumberGame = () => {
  // Khởi tạo state cho số ngẫu nhiên từ 1 đến 100
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * 100) + 1
  );
  // Khởi tạo state để lưu giá trị số người dùng nhập vào
  const [guess, setGuess] = useState("");
  // Khởi tạo state để hiển thị thông báo kết quả đoán số
  const [message, setMessage] = useState("");
  // Khởi tạo state để theo dõi số lượt đoán còn lại (bắt đầu với 10)
  const [attempts, setAttempts] = useState(10);

  // Xử lý khi người dùng nhấn nút "Đoán"
  const handleGuess = () => {
    const userGuess = parseInt(guess, 10); // Chuyển đổi giá trị nhập vào thành số nguyên
    // Kiểm tra nếu người chơi nhập sai (không phải số hoặc ngoài phạm vi 1-100)
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      antdMessage.warning("Vui lòng nhập số hợp lệ từ 1 đến 100!"); // Hiển thị cảnh báo
      return;
    }

    // Kiểm tra kết quả đoán
    if (userGuess === randomNumber) {
      setMessage("🎉 Chúc mừng! Bạn đã đoán đúng!"); // Thông báo đoán đúng
      antdMessage.success("Bạn đã đoán đúng!"); // Hiển thị thông báo thành công
    } else if (userGuess < randomNumber) {
      setMessage("Bạn đoán quá thấp!"); // Thông báo đoán thấp hơn số đúng
    } else {
      setMessage("Bạn đoán quá cao!"); // Thông báo đoán cao hơn số đúng
    }

    // Giảm số lượt đoán còn lại
    setAttempts((prev) => prev - 1);

    // Nếu hết lượt mà vẫn chưa đoán đúng, hiển thị kết quả
    if (attempts - 1 === 0 && userGuess !== randomNumber) {
      setMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`); // Thông báo thua cuộc
      antdMessage.error(`Bạn đã thua! Số đúng là ${randomNumber}.`); // Hiển thị thông báo lỗi
    }
  };

  // Hàm khởi động lại trò chơi
  const restartGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1); // Tạo số ngẫu nhiên mới
    setGuess(""); // Đặt lại ô nhập về rỗng
    setMessage(""); // Xóa thông báo cũ
    setAttempts(10); // Đặt lại số lượt đoán về 10
  };

  return (
    <div 
      style={{
        padding: "20px",
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Trò Chơi Đoán Số</h1>
      <p>Hãy đoán một số từ 1 đến 100!</p>

      {/* Ô nhập số đoán */}
      <Input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        style={{ marginBottom: "10px", width: "100%" }}
      />

      {/* Nút đoán số */}
      <Button type="primary" onClick={handleGuess} style={{ width: "100%" }}>
        Đoán
      </Button>

      {/* Hiển thị thông báo đoán sai hoặc đúng */}
      <p style={{ marginTop: "10px", color: "red" }}>{message}</p>

      {/* Hiển thị số lượt đoán còn lại */}
      <p>Lượt còn lại: {attempts}</p>

      {/* Nút chơi lại khi hết lượt hoặc đoán đúng */}
      {attempts === 0 || message.includes("Chúc mừng") ? (
        <Button onClick={restartGame} type="dashed" style={{ marginTop: "10px", width: "100%" }}>
          Chơi lại
        </Button>
      ) : null}
    </div>
  );
};

export default GuessNumberGame; // Xuất component để sử dụng trong ứng dụng
