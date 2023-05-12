import React, { useEffect, useRef, useState } from "react";
import {
	Button,
	CircularProgress,
	IconButton,
	InputAdornment,
	TextField,
	styled,
} from "@mui/material";
import Background from "../Assets/PwC_Geom_28.png";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendIcon from "@mui/icons-material/Send";

const VideoSummariser = () => {
	const drop = useRef(null);
	const [videoFile, setVideoFile] = useState(null);
	const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [showAnswerSection, setShowAnswerSection] = useState(false);
	const [loading, setLoading] = useState(false);

	const SelectVideo = (e) => {
		setShowAnswerSection(false);
		setVideoFile(e.target.files[0]);
		setSelectedVideoUrl(URL.createObjectURL(e.target.files[0]));
	};

	const BrowseFile = () => {
		document.getElementById("fileSelector").click();
	};

	useEffect(() => {
		drop?.current?.addEventListener("dragover", HandleDragOver);
		drop?.current?.addEventListener("drop", HandleDrop);
		return () => {
			// eslint-disable-next-line
			drop?.current?.removeEventListener("dragover", HandleDragOver);
			// eslint-disable-next-line
			drop?.current?.removeEventListener("drop", HandleDrop);
		};
	}, []);

	const HandleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const HandleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setShowAnswerSection(false);
		setVideoFile(e.dataTransfer.files[0]);
		setSelectedVideoUrl(URL.createObjectURL(e.dataTransfer.files[0]));
	};

	const onQuestionInputChange = (e) => {
		setQuestion(e.target.value);
	};

	const questionSubmissionCheck = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			AskQuestion();
		}
	};

	const AskQuestion = () => {
		setShowAnswerSection(true);
		setLoading(true);
		let formData = new FormData();
		formData.append("file", videoFile);
		formData.append("question", question);
		fetch("https://generativeaidev.azurewebsites.net/fileupload", {
			method: "POST",
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				setShowAnswerSection(true);
				setAnswer(data.answer);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setShowAnswerSection(false);
				setLoading(false);
			});
	};

	return (
		<Container>
			<Header>Video Summarisation Using GPT-3</Header>
			<Wrapper>
				<WrapperHeader>Upload a Video & Ask Questions</WrapperHeader>
				<FileDropZoneContainer>
					<FileDropZone ref={drop}>
						<CloudUploadIcon style={{ fontSize: 60, color: "#D93954" }} />
						<UploadText className="large">Drag file to upload</UploadText>
						<UploadText className="small">Or</UploadText>
						<BrowseFileButton onClick={BrowseFile}>
							Browse Files
						</BrowseFileButton>
						<HiddenInput
							id="fileSelector"
							accept="video/mp4,video/x-m4v,video/*"
							type="file"
							onChange={SelectVideo}
						/>
					</FileDropZone>
					{selectedVideoUrl && videoFile && (
						<PreviewContainer>
							<VideoPreview src={selectedVideoUrl} controls></VideoPreview>
							<UploadText className="small">
								{videoFile?.name} <br />{" "}
								<span style={{ color: "rgb(0,0,0,0.5)", fontSize: "12px" }}>
									{Math.round(videoFile?.size / 100000) / 10} MB
								</span>
							</UploadText>
						</PreviewContainer>
					)}
				</FileDropZoneContainer>

				{videoFile !== null && (
					<QuestionInput
						placeholder="Type your question here..."
						onChange={onQuestionInputChange}
						onKeyUp={questionSubmissionCheck}
						value={question}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={AskQuestion}>
										<SendIcon style={{ color: "#D93954" }} />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				)}

				{showAnswerSection && (
					<>
						{loading ? (
							<CircularProgress
								style={{ color: "#D93954", marginBottom: "20px" }}
							/>
						) : (
							<AnswerSection>{answer}</AnswerSection>
						)}
					</>
				)}
			</Wrapper>
		</Container>
	);
};

const Container = styled("div")({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	minHeight: "100vh",
	backgroundImage: `url(${Background})`,
	backgroundSize: "cover",
	backgroundPosition: "center",
});

const Header = styled("div")({
	position: "absolute",
	top: 0,
	textAlign: "center",
	padding: "10px 40px",
	fontSize: "25px",
	fontWeight: 400,
	textTransform: "uppercase",
	boxShadow: "0px 20px 15px -10px rgba(0,0,0,0.3)",
	color: "#EBEBEB",
	background: "#2D2D2D",
});

const Wrapper = styled("div")({
	display: "flex",
	flexDirection: "column",
	width: "60%",
	background: "#FFFFFF",
	justifyContent: "space-between",
	alignItems: "center",
	marginTop: "50px",
	borderRadius: "10px",
	boxShadow: "0px 20px 15px -10px rgba(0,0,0,0.3)",
});

const WrapperHeader = styled("div")({
	fontSize: "20px",
	fontWeight: 400,
	textTransform: "uppercase",
	color: "#EBEBEB",
	boxShadow: "0px 20px 15px -10px rgba(0,0,0,0.3)",
	background: "#2D2D2D",
	padding: "10px 40px",
	borderRadius: "10px 10px 0 0",
	textAlign: "center",
	width: "-webkit-fill-available",
});

const FileDropZoneContainer = styled("div")({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-evenly",
	width: "100%",
	margin: "40px 0",
});

const FileDropZone = styled("div")({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	padding: "60px 40px",
	border: "3px dashed #2D2D2D",
	borderRadius: "20px",
});

const UploadText = styled("div")({
	fontWeight: 350,
	fontFamily: "Helvetica Neue",
	color: "#2D2D2D",
	textAlign: "left",
	marginTop: "10px",
	"&.large": {
		fontSize: "20px",
	},
	"&.small": {
		fontSize: "15px",
	},
});

const BrowseFileButton = styled(Button)({
	background: "#D93954",
	color: "#FFFFFF",
	fontWeight: 400,
	fontSize: "15px",
	padding: "5px 20px",
	marginTop: "10px",
	borderRadius: "30px",
	"&:hover": {
		background: "#D93954",
		opacity: 0.8,
	},
});

const HiddenInput = styled("input")({
	display: "none",
});

const PreviewContainer = styled("div")({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "flex-start",
});

const VideoPreview = styled("video")({
	maxWidth: "300px",
	minHeight: "150px",
	maxHeight: "250px",
	objectFit: "cover",
	borderRadius: "10px",
});

const QuestionInput = styled(TextField)({
	resize: "none",
	width: "80%",
	borderRadius: "20px",
	marginBottom: "20px",
	backgroundColor: "#EEEEEE",
	"& fieldset": {
		borderColor: "#FFFFFF",
	},
	"& .MuiOutlinedInput-root": {
		"&:hover fieldset": {
			borderColor: "#D93954",
			borderRadius: "20px",
		},
	},
	"& .MuiOutlinedInput-root.Mui-focused": {
		"& > fieldset": {
			borderColor: "#D93954",
			borderRadius: "20px",
		},
	},
});

const AnswerSection = styled("div")({
	width: "75%",
	borderRadius: "10px",
	marginBottom: "20px",
	backgroundColor: "#EEEEEE",
	minHeight: "70px",
	padding: "20px 20px",
	textAlign: "left",
	whiteSpace: "pre-wrap",
	fontFamily: "Helvetica Neue",
	fontSize: "15px",
	fontWeight: 350,
});

export default VideoSummariser;
