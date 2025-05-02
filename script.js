fetch('data.json')
  .then(res => res.json())
  .then(data => {
    const listDiv = document.getElementById("question-list");
    const searchInput = document.getElementById("search");

    function normalize(text) {
      return text
        .toLowerCase()
        .replace(/[^\wㄱ-ㅎ가-힣\s]/g, '')  // 특수문자 제거
        .replace(/\s+/g, ' ')                // 공백 정리
        .trim();
    }

    function highlight(text, keyword) {
      if (!keyword) return text;
      const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(\`(\${safeKeyword})\`, 'gi');
      return text.replace(pattern, '<mark>$1</mark>');
    }

    function renderList(filtered, keyword = "") {
      listDiv.innerHTML = "";
      if (filtered.length === 0) {
        listDiv.innerHTML = "<p>검색 결과가 없습니다.</p>";
        return;
      }
      filtered.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "question-card";
        div.innerHTML = `
          <p><strong>Q${i + 1}:</strong> ${highlight(q.question, keyword)}</p>
          <p class="answer">정답: ${highlight(q.answer, keyword)}</p>
        `;
        listDiv.appendChild(div);
      });
    }

    const datalist = document.createElement("datalist");
    datalist.id = "suggestions";
    document.body.appendChild(datalist);
    searchInput.setAttribute("list", "suggestions");

    const allWords = [...new Set(data.flatMap(q =>
      [...q.question.split(/\s+/), ...q.answer.split(/\s+/)]
    ))];

    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.trim();
      const normalizedKeyword = normalize(keyword);

      datalist.innerHTML = "";
      const matched = allWords.filter(word => normalize(word).includes(normalizedKeyword)).slice(0, 10);
      matched.forEach(word => {
        const option = document.createElement("option");
        option.value = word;
        datalist.appendChild(option);
      });

      const filtered = data.filter(q =>
        normalize(q.question).includes(normalizedKeyword) ||
        normalize(q.answer).includes(normalizedKeyword)
      );
      renderList(filtered, keyword);
    });

    renderList(data);
  });