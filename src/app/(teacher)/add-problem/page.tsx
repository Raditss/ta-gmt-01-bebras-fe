'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { toast } from 'sonner';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CreateQuestionMetadataRequest,
  createQuestionMetadataRequestSchema
} from '@/utils/validations/question.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionsApi } from '@/lib/api';
import { QuestionTypeResponse } from '@/utils/validations/question-type.validation';
import { questionTypeApi } from '@/lib/api/question-type.api';

const AddProblemPage = () => {
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeResponse[]>();
  const router = useRouter();

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const types = await questionTypeApi.getQuestionTypes();
        setQuestionTypes(types);
      } catch (error) {
        console.error('Failed to fetch question types:', error);
        toast.error('Gagal memuat jenis soal. Silakan coba lagi nanti.');
      }
    };
    fetchQuestionTypes();
  }, []);

  const newQuestionForm = useForm<CreateQuestionMetadataRequest>({
    mode: 'onSubmit',
    resolver: zodResolver(createQuestionMetadataRequestSchema),
    defaultValues: {
      title: '',
      points: 100,
      estimatedTime: 30
    }
  });

  const addQuestion: SubmitHandler<CreateQuestionMetadataRequest> = async (
    data,
    event
  ) => {
    event?.preventDefault();
    const question = await questionsApi.createQuestionMetadata(data);
    if (question) {
      toast.success('Anda berhasil menambahkan soal baru', {
        duration: 2000
      });
      router.push(
        `/add-problem/create/${question.props.questionType.name}/${question.props.id}`
      );
      newQuestionForm.reset();
    } else {
      newQuestionForm.setError('root', {
        type: 'manual',
        message: 'Gagal membuat metadata soal. Silakan coba lagi nanti.'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Tambah Soal Baru</CardTitle>
            <CardDescription>
              Buat soal baru dan tetapkan ke jenis soal tertentu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...newQuestionForm}>
              <form
                onSubmit={newQuestionForm.handleSubmit(addQuestion)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <FormField
                    control={newQuestionForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Soal</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Masukkan judul untuk soal ini"
                            required
                          />
                        </FormControl>
                        <FormDescription>
                          Judul ini akan digunakan untuk mengidentifikasi soal
                          dalam sistem.
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
                        <FormLabel>Jenis Soal</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis soal" />
                            </SelectTrigger>
                            <SelectContent>
                              {questionTypes &&
                                questionTypes.map((type) => (
                                  <SelectItem
                                    key={type.props.id}
                                    value={String(type.props.id)}
                                  >
                                    {type.props.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Pilih jenis soal yang ingin Anda buat.
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
                          <FormLabel>Poin</FormLabel>
                          <FormControl>
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
                            Tetapkan poin untuk soal ini. Default adalah 100.
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
                          <FormLabel>Perkiraan Waktu (detik)</FormLabel>
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
                            Perkiraan waktu untuk menyelesaikan soal ini dalam
                            detik. Default adalah 30.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {newQuestionForm.formState.errors.root && (
                  <div className="text-red-500 text-sm">
                    {newQuestionForm.formState.errors.root.message}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Lanjut ke Pembuatan Soal
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddProblemPage;
