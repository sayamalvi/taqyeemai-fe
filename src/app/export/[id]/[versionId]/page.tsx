import { headers } from 'next/headers';

// This exactly matches the schema in backend/src/resume/utils.ts
interface ParsedData {
    name: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    skills: string[];
    education: { institution: string; degree: string; year: string }[];
    experience: { company: string; role: string; duration: string; bullets: string[] }[];
    projects: { name: string; duration: string; bullets: string[] }[];
}

export default async function ExportPage({ params }: { params: Promise<{ id: string, versionId: string }> }) {

    const resolvedParams = await params;
    
    const incomingHeaders = await headers();
    const authorization = incomingHeaders.get('authorization') || '';
    const cookie = incomingHeaders.get('cookie') || '';
    
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const res = await fetch(`${baseUrl}/resume/${resolvedParams.id}/versions/${resolvedParams.versionId}/analysis`, {
        cache: 'no-store',
        headers: {
            'Authorization': authorization,
            'Cookie': cookie
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        return (
            <div className="p-8 text-red-500">
                <h1 className="text-2xl font-bold">Failed to load data!</h1>
                <p>Status Code: {res.status}</p>
                <p>Backend Error: {errorText}</p>
            </div>
        );
    }

    const json = await res.json();
    const data: ParsedData = json.analysis?.parsedData || {};

    return (
        <main className="bg-white text-black min-h-[100vh] w-full p-10 max-w-[210mm] mx-auto font-sans leading-relaxed relative">
            <style dangerouslySetInnerHTML={{ __html: `
                body { background: white !important; color: black !important; }
                @page { margin: 0; }
            ` }} />
            
            {/* HEADER */}
            <header className="text-center mb-8 border-b-2 border-black pb-6">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase">{data.name || "Your Name"}</h1>
                <div className="text-gray-600 flex justify-center items-center gap-4 text-sm font-medium flex-wrap">
                    <span>{data.email || "email@example.com"}</span>
                    {data.phone && <span>• {data.phone}</span>}
                    {data.github && <span>• {data.github.replace('https://', '')}</span>}
                    {data.linkedin && <span>• {data.linkedin.replace('https://', '')}</span>}
                </div>
            </header>

            {/* SKILLS */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 mb-3 pb-1">Technical Skills</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {data.skills.join(" • ")}
                    </p>
                </section>
            )}

            {/* EXPERIENCE */}
            {data.experience && data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 mb-3 pb-1">Professional Experience</h2>
                    
                    <div className="flex flex-col gap-5">
                        {data.experience.map((job, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900 text-base">{job.role} <span className="font-normal italic">at {job.company}</span></h3>
                                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{job.duration}</span>
                                </div>
                                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1.5 marker:text-gray-400">
                                    {job.bullets?.map((bullet: string, j: number) => (
                                        <li key={j} className="pl-1">{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* PROJECTS */}
            {data.projects && data.projects.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 mb-3 pb-1">Projects</h2>
                    
                    <div className="flex flex-col gap-5">
                        {data.projects.map((project, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900 text-base">{project.name}</h3>
                                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{project.duration}</span>
                                </div>
                                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1.5 marker:text-gray-400">
                                    {project.bullets?.map((bullet: string, j: number) => (
                                        <li key={j} className="pl-1">{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* EDUCATION */}
            {data.education && data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 mb-3 pb-1">Education</h2>
                    
                    <div className="flex flex-col gap-4">
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">{edu.degree}</h3>
                                    <p className="text-sm text-gray-600">{edu.institution}</p>
                                </div>
                                <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{edu.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </main>
    );
}
