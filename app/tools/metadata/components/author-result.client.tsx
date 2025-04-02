"use client";

import { AuthorOutput } from "../types";
import { CopyButton } from "./copy-button.client";

interface AuthorResultProps {
  authorOutput: AuthorOutput;
  activeTab: "input" | "result";
}

export function AuthorResult({ authorOutput, activeTab }: AuthorResultProps) {
  if (activeTab !== "result" || authorOutput.authors.length === 0) {
    return null;
  }

  return (
    <div className='space-y-2 text-sm'>
      <h4 className='font-medium'>Authors:</h4>
      {authorOutput.authors.map((author, i) => {
        const _authorId = `author-${i}`;
        const _emailId = `email-${i}`;

        return (
          <div key={i} className='space-y-2 border-b pb-4 pl-4 last:border-0'>
            <div className='mb-2 font-medium'>Author {i + 1}</div>

            <div className='grid gap-2 text-sm'>
              <div className='flex items-center gap-2'>
                <div>
                  <span className='text-muted-foreground'>Name:</span> {author.name}
                </div>
                <CopyButton text={author.name} />
              </div>

              {author.affiliations.map((affId) => {
                const aff = authorOutput.affiliations.find((a) => a.id === affId);
                if (!aff) return null;

                return (
                  <div key={affId} className='flex items-center gap-2'>
                    <div>
                      <span className='text-muted-foreground'>Affiliation {affId}:</span> {aff.text}
                    </div>
                    <CopyButton text={aff.text} />
                  </div>
                );
              })}

              {author.isCorresponding && author.email && (
                <div className='flex items-center gap-2'>
                  <div>
                    <span className='text-muted-foreground'>Email:</span> {author.email}
                    <span className='ml-2 text-xs text-blue-700'>(Corresponding Author)</span>
                  </div>
                  <CopyButton text={author.email} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
