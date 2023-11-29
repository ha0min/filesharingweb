import {Text, Container, Tabs, Paper, Title, Flex, Stack, TextInput, FileInput, Button, Image} from "@mantine/core";
import {useState} from "react";
import {useForm} from "@mantine/form";


const submitUploadForm = async (values: any) => {
    console.log(values);
    const formData = new FormData();

    // Append the file and course name to the FormData
    formData.append('file', values.file);
    formData.append('course_name', values.coursename);

    // Make the fetch request to the server
    try {
        const response = await fetch('/api/user/new_file', {
            method: 'POST',
            body: formData,
        });

        console.log(response)
        if (!response.ok) {
            return {
                success: "error",
                message: response.statusText
            }
        }

        const data = await response.json();
        console.log('Success:', data);
        return {
            success: "success",
            message: data.message
        }
    } catch (error: any) {
        console.error('Error:', error);
        return {
            success: "error",
            message: error.message
        }
    }
}

const UploadTab = () => {
    const form = useForm({
        initialValues: {
            coursename: '',
            file: '',
        },

        validate: {
            coursename: (value) => (/^[A-Za-z]{4}\d+$/.test(value) ? null : 'Invalid coursename'),
        },
    });

    const [result, setResult] = useState({
            success: "",
            message: "",
        }
    );

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setIsLoading(true);
        const res = await submitUploadForm(values);
        setIsLoading(false);
        setResult(res); // Assuming 'res' is an object
    }

    if (result.success !== "") {
        if (result.success === "success") {
            return (
                <Stack p="md" align="center">
                    <Image
                        src="https://em-content.zobj.net/source/telegram/386/party-popper_1f389.webp"
                        alt="success"
                        w={100}
                        h={100}
                    />

                    <Title>Your syllabus shared successfully!</Title>
                    <Button onClick={() => {
                        setResult({
                            success: "",
                            message: "",
                        });
                        form.reset();
                    }
                    }>Submit a new syllabus</Button>
                </Stack>
            )
        } else {
            return (
                <Stack p="md" align="center">
                    <Image
                        src="https://em-content.zobj.net/source/telegram/386/smiling-face-with-tear_1f972.webp"
                        alt="error"
                        w={100}
                        h={100}
                    />

                    <Title>Oops! Something went wrong</Title>
                    <Text c="red">{result.message}</Text>

                    <Button onClick={() => setResult({
                        success: "",
                        message: "",
                    })}>Try again</Button>
                </Stack>
            )
        }
    }

    return (
        <form
            onSubmit={form.onSubmit(handleSubmit)}>
            <Stack p="md">
                <TextInput
                    label="Course Name"
                    placeholder="e.g. CSEN317"
                    required
                    {...form.getInputProps('coursename')}
                />
                <FileInput
                    label="Syllabus File"
                    accept="application/pdf"
                    placeholder="choose your syllabus file here"
                    required
                    {...form.getInputProps('file')}
                />
                <Button loading={isLoading} type="submit">Upload</Button>
            </Stack>
        </form>
    );
}


const submitQueryForm = async ({courseName,}: { courseName: string }) => {
    console.log(courseName);
    // Append the file and course name to the FormData

    // Make the fetch request to the server
    try {
        const response = await fetch(`/api/user/query_file?filename=${courseName}`);

        console.log(response)
        if (!response.ok) {
            return {
                success: "error",
                message: response.statusText
            }
        }
        const data = await response.text();
        console.log('Query Success:', data);
        return {
            success: "success",
            message: data
        }
    } catch (error: any) {
        console.error('Error:', error);
        return {
            success: "error",
            message: error.message
        }
    }
}

const QueryTab = () => {

    const form = useForm({
            initialValues: {
                courseName: '',
            },

            validate: {
                courseName: (value) => (/^[A-Za-z]{4}\d+$/.test(value) ?
                    null : 'Invalid Course, put department code with course number'),
            }
        }
    );

    const [result, setResult] = useState({
            success: "",
            message: "",
        }
    );

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setIsLoading(true);
        const res = await submitQueryForm(values);
        setIsLoading(false);
        setResult(res); // Assuming 'res' is an object
    }

    if (result.success !== "") {
        if (result.success === "success") {
            if (result.message === "File not found in chord") {
                return (
                    <Stack p="md" align="center">
                        <Image
                            src="https://em-content.zobj.net/source/telegram/386/dizzy-face_1f635.webp"
                            alt="success"
                            w={100}
                            h={100}
                        />

                        <Title style={
                            {
                                textAlign: "center",
                            }
                        } >Sorry, {form.values.courseName} syllabus is not found!</Title>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setResult({
                                    success: "",
                                    message: "",
                                });
                                form.reset();
                            }}
                        >
                            Try a New Query
                        </Button>

                    </Stack>
                )
            } else {
                return (
                    <Stack p="md" align="center">
                        <Image
                            src="https://em-content.zobj.net/source/telegram/386/party-popper_1f389.webp"
                            alt="success"
                            w={100}
                            h={100}
                        />

                        <Title>Here is your syllabus for {form.values.courseName}!</Title>

                        <Flex>
                            <Button
                                mr="md"
                                variant="outline"
                                onClick={() => {
                                    setResult({
                                        success: "",
                                        message: "",
                                    });
                                    form.reset();
                                }}
                            >
                                New Query
                            </Button>
                            <Button
                                onClick={() => {
                                    if (result.message) {
                                        window.open(result.message, '_blank');
                                    }
                                }}
                            >
                                Download File
                            </Button>
                        </Flex>
                    </Stack>
                )
            }
        } else {
            return (
                <Stack p="md" align="center">
                    <Image
                        src="https://em-content.zobj.net/source/telegram/386/smiling-face-with-tear_1f972.webp"
                        alt="error"
                        w={100}
                        h={100}
                    />

                    <Title>Oops! Something went wrong</Title>
                    <Text c="red">{result.message}</Text>

                    <Button onClick={() => setResult({
                        success: "",
                        message: "",
                    })}>Try again</Button>
                </Stack>
            )
        }
    }

    return (
        <form
            onSubmit={form.onSubmit(handleSubmit)}>
            <Stack p="md">
                <TextInput
                    label="Course Name"
                    placeholder="e.g. CSEN317"
                    required
                    {...form.getInputProps('courseName')}
                />
                <Button loading={isLoading} type="submit">Search</Button>
            </Stack>
        </form>
    );
}

const TabList = () => {
    const [activeTab, setActiveTab] = useState<string | null>('upload');

    return (
        <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
                <Tabs.Tab value="upload">Upload</Tabs.Tab>
                <Tabs.Tab value="query">Query</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="upload">
                <UploadTab/>
            </Tabs.Panel>
            <Tabs.Panel value="query">
                <QueryTab/>
            </Tabs.Panel>
        </Tabs>
    )
}

export default function IndexPage() {

    return (
        <Container
            p="md"
        >
            <Paper p="md" withBorder>
                <Flex justify="center">
                    <Stack p="sm">
                        <Title order={1}>👋Welcome to Syllabus Share @SCU!</Title>
                    </Stack>
                </Flex>
                <TabList/>
            </Paper>
        </Container>
    );
}
