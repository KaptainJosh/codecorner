$(document).ready(() => {
	tags = [];

	updatePostPreview();

	$("#submitButton").click(() => {
		console.log($("#postTextarea").val());

		//Epoch timestamp code based on https://futurestud.io/tutorials/get-number-of-seconds-since-epoch-in-javascript 
		const currentTime = new Date();
		const utcMilllisecondsSinceEpoch = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60 * 1000);
		const utcSecondsSinceEpoch = Math.round(utcMilllisecondsSinceEpoch / 1000);

		const postData = {
			user: "Prototype",
			time: utcSecondsSinceEpoch,
			content: $("#postTextarea").val(),
			tags: tags
		};

		fetch("/submitPost", {
			method: "POST",
			headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
			body: JSON.stringify(postData)
			}).then(res => console.log("Post submitted!")
		);

		window.location.reload();
	});

	//Mark highlighted text as code
	$("#codeButton").click(() => {
		let selectedText = getSel("postTextarea");
		if (!selectedText)
			return;
		
		let htmlText = $("#postTextarea").val().replace(selectedText, `<pre><code>${selectedText}</code></pre>`);
		$('#postTextarea').val(htmlText);
		updatePostPreview();
	});

	//Update post preview
	$("#postTextarea").bind("input propertychange", () => {
		updatePostPreview();
	});

	$(".tagToAdd").click(function() {
		tags.push(this.innerText);
		this.parentNode.removeChild(this);
		updatePostPreview();
	});

	$(".addedTag").click(function() {
		tags.splice(tags.indexOf(this), 1);
		this.parentNode.removeChild(this);
		updatePostPreview();
	});
});

function updatePostPreview()
{
	//Extract portions within code tags because hljs only works if those characters aren't escaped
	//But other characters need to be escaped to appear correctly, especially newlines

	let baseText = $("#postTextarea").val();//.replaceAll("\n", "<br/>").replaceAll(" ", "&nbsp;");
	let inCodeSnippet = false;

	const codeStart = "<pre><code>";
	const codeEnd = "</code></pre>";

	let replacedText = "";
	let index = 0;

	while (baseText.length > 0)
	{
		if (baseText.indexOf(codeStart) == index)
		{
			if (index > 0)
			{
				let text = baseText.substring(0, index);
				replacedText += text;
			}

			let end = baseText.indexOf(codeEnd) + codeEnd.length;
			let snippet = baseText.substring(index, end);
			replacedText += snippet;
			baseText = baseText.substring(end + 1);

			index = 0;
		}
		else if (baseText[index] == "\n")
		{
			if (index > 0)
			{
				let text = baseText.substring(0, index);
				replacedText += text;
			}

			replacedText += "<br/>";
			baseText = baseText.substring(index + 1);

			index = 0;
		}
		else if (baseText[index] == " ")
		{
			if (index > 0)
			{
				let text = baseText.substring(0, index);
				replacedText += text;
			}

			replacedText += "&nbsp;";
			baseText = baseText.substring(index + 1);

			index = 0;
		}
		else
		{
			index++;

			if (index > baseText.length)
			{
				replacedText += baseText;
				break;
			}
		}
	}

	$("#postPreview").html(replacedText);

	hljs.highlightAll();

	let tagPreview = "<ul>";
	for (let tag of tags) {
		tagPreview += `<li class="addedTag">` + tag + "</li>";
	}
	tagPreview += "</ul>";
	$("#tagPreview").html(tagPreview);

	$(".addedTag").click(function() {
		tags.splice(tags.indexOf(this.innerHTML), 1);
		this.parentNode.removeChild(this);

		let newListElement = document.createElement("li");
		newListElement.innerHTML = this.innerHTML;
		newListElement.setAttribute("class", "tagToAdd");
		
		newListElement.onclick = function() {
			tags.push(this.innerText);
			this.parentNode.removeChild(this);
			updatePostPreview();
		};
		$("#tagSelection").append(newListElement);

		updatePostPreview();
	});
}

//Return the highlighted portion of a textarea
//Courtesy of https://stackoverflow.com/questions/717224/how-to-get-selected-text-in-textarea
function getSel(name) // javascript
{
    // obtain the object reference for the <textarea>
    var txtarea = document.getElementById(name);
    // obtain the index of the first selected character
    var start = txtarea.selectionStart;
    // obtain the index of the last selected character
    var finish = txtarea.selectionEnd;
    // obtain the selected text
    var sel = txtarea.value.substring(start, finish);
    // do something with the selected content

	return sel;
}
