document.addEventListener("DOMContentLoaded", () => {
  const profileImage = document.getElementById("profile-image");
  const fileInput = document.getElementById("file-input");
  const profileImageUrlInput = document.getElementById("profileImageUrl");
  const registerForm = document.getElementById("register-form");

  profileImage.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Upload result:", result); // 응답 데이터 로그 추가

        if (result.fileUrl) {
          // 프로필 이미지 div의 배경 이미지를 업로드된 이미지 URL로 설정
          profileImage.style.backgroundImage = `url(${result.fileUrl})`;
          console.log("Background image updated:", result.fileUrl); // 로그 추가
          // hidden input 필드에 업로드된 이미지 URL을 설정
          profileImageUrlInput.value = result.fileUrl;
        } else {
          alert("이미지 업로드에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  });

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // 기본 폼 제출 동작을 막음

    const formData = new FormData(registerForm);

    // 폼 데이터 로그 출력
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await fetch("/register/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 성공 시 리디렉션 또는 성공 메시지 표시
      window.location.href = "/login"; // 회원가입 후 로그인 페이지로 리디렉션
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("회원가입에 실패했습니다.");
    }
  });
});
