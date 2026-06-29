import { PageHeader, TopicList } from '@/components/ui';
import InterviewClient from './InterviewClient';

export default function Page() {
  return (
    <>
      <PageHeader kicker="Center of product" title="AI interview dashboard">
        <p>
          A private, text-first interviewer builds your compatibility model from conversation evidence. There is no voice and
          no always-listening microphone — you type, you click send, and you stay in control of what the model records.
        </p>
      </PageHeader>
      <div className="grid gap-8">
        <InterviewClient />
        <section>
          <h2 className="mb-4 text-2xl font-black tracking-[-.04em]">Topic coverage</h2>
          <TopicList />
        </section>
      </div>
    </>
  );
}
