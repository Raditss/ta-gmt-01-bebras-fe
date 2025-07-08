"use client"

import {useEffect, useState} from "react"
import { MainNavbar } from "@/components/layout/Nav/main-navbar"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl, FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {SubmitHandler, useForm} from "react-hook-form";
import {CreateQuestionMetadataRequest, createQuestionMetadataRequestSchema} from "@/utils/validations/question.validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {questionsApi} from "@/lib/api";
import {QuestionTypeResponse} from "@/utils/validations/question-type.validation";
import {questionTypeApi} from "@/lib/api/question-type.api";


const AddProblemPage = () => {
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeResponse[]>()
  const router = useRouter()

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const types = await questionTypeApi.getQuestionTypes();
        setQuestionTypes(types);
      } catch (error) {
        console.error("Failed to fetch question types:", error);
        toast.error("Failed to load question types. Please try again later.");
      }
    };
    fetchQuestionTypes();
  }, []);

  const newQuestionForm = useForm<CreateQuestionMetadataRequest>({
    mode: "onSubmit",
    resolver: zodResolver(createQuestionMetadataRequestSchema),
    defaultValues: {
      title: "",
      points: 100,
      estimatedTime: 30,
    }
  });

  const addQuestion: SubmitHandler<CreateQuestionMetadataRequest> = async (data, event) => {
    event?.preventDefault();
    const question = await questionsApi.createQuestionMetadata(data)
    if (question) {
      toast.success("You have successfully added new question", {
        duration: 2000,
      });
        router.push(`/add-problem/create/${question.props.questionType.name}/${question.props.id}`);
      newQuestionForm.reset();
    } else {
      newQuestionForm.setError("root", {
        type: "manual",
        message: "Failed to create question metadata. Please try again later."
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Add New Problem</CardTitle>
            <CardDescription>
              Create a new problem and assign it to a specific question type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...newQuestionForm}>
              <form onSubmit={newQuestionForm.handleSubmit(addQuestion)} className="space-y-6">
                <div className="space-y-2">
                  <FormField
                    control={newQuestionForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter a title for this problem"
                            required
                          />
                        </FormControl>
                        <FormDescription>
                          This title will be used to identify the problem in the system.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                  )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={newQuestionForm.control}
                    name={'questionTypeId'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <FormControl>
                          <Select onValueChange={(value) => field.onChange(Number(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a question type" />
                            </SelectTrigger>
                            <SelectContent>
                              {questionTypes && questionTypes.map((type) => (
                                <SelectItem key={type.props.id} value={String(type.props.id)}>
                                  {type.props.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select the type of question you want to create.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={newQuestionForm.control}
                      name={'points'}
                      render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points</FormLabel>
                        <FormControl
                          >
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            max="100"
                            placeholder="100"
                            required
                          />
                        </FormControl>
                        <FormDescription>
                          Assign points to this question. Default is 100.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={newQuestionForm.control}
                      name={'estimatedTime'}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Time (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              placeholder="30"
                              required
                            />
                          </FormControl>
                          <FormDescription>
                            Estimated time to solve this question in minutes. Default is 30.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                { newQuestionForm.formState.errors.root && (
                  <div className="text-red-500 text-sm">
                    {newQuestionForm.formState.errors.root.message}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Continue to Question Creation
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default AddProblemPage;