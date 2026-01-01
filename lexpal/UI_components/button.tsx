import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

type Button1Props = {
  onClick?: () => void;
};


const Button1 = ({ onClick }: Button1Props) => {
  const router= useRouter();
  return (
    <StyledWrapper>
      <div className="btn-wrapper">
        <button className="btn" onClick={onClick}>
          <svg className="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"/>
          </svg>

          <div className="txt-wrapper">
            <div className="txt-1">
              <span className="btn-letter">T</span>
              <span className="btn-letter">a</span>
              <span className="btn-letter">l</span>
              <span className="btn-letter">k</span>
              <span className="btn-letter">&nbsp;</span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">o</span>
              <span className="btn-letter">&nbsp;</span>
              <span className="btn-letter">A</span>
              <span className="btn-letter">I</span>
            </div>
          </div>
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .btn-wrapper {
    position: relative;
    display: inline-block;
  }

  .btn {
    --border-radius: 24px;
    --padding: 4px;
    --transition: 0.4s;
    --button-color: #101010;

    display: flex;
    align-items: center;
    padding: 0.5em 1.2em;
    background: var(--button-color);
    border-radius: var(--border-radius);
    border: 1px solid #ffffff22;
    cursor: pointer;

    box-shadow:
      inset 0 1px 1px #ffffff33,
      inset 0 4px 4px #ffffff11,
      0 -4px 8px #00000022;

    transition: border var(--transition), box-shadow var(--transition);
  }

  .btn-letter {
    display: inline-block;
    color: #ffffff55;
    animation: letterWave 2s ease-in-out infinite;
  }

  @keyframes letterWave {
    50% {
      color: #fff;
      text-shadow: 0 0 6px #ffffffcc;
    }
  }

  /* Staggered delays = wave effect */
  .btn-letter:nth-child(1) { animation-delay: 0s }
  .btn-letter:nth-child(2) { animation-delay: 0.07s }
  .btn-letter:nth-child(3) { animation-delay: 0.14s }
  .btn-letter:nth-child(4) { animation-delay: 0.21s }
  .btn-letter:nth-child(5) { animation-delay: 0.28s }
  .btn-letter:nth-child(6) { animation-delay: 0.35s }
  .btn-letter:nth-child(7) { animation-delay: 0.42s }
  .btn-letter:nth-child(8) { animation-delay: 0.49s }
  .btn-letter:nth-child(9) { animation-delay: 0.56s }
  .btn-letter:nth-child(10){ animation-delay: 0.63s }

  /* Icon pulse maintained */
  .btn-svg {
    height: 24px;
    margin-right: 0.5rem;
    fill: #e8e8e8;
    animation: iconPulse 2s linear infinite;
    filter: drop-shadow(0 0 2px #ffffffaa);
  }

  @keyframes iconPulse {
    50% {
      opacity: 0.4;
      filter: drop-shadow(0 0 6px #6bb6ffcc);
    }
  }

  /* Hover keeps glow */
  .btn:hover {
    border: 1px solid #6bb6ff66;
    box-shadow:
      inset 0 1px 1px #ffffff55,
      inset 0 4px 4px #ffffff22,
      0 -4px 10px #6bb6ff55;
  }

  .btn:hover .btn-svg {
    fill: #fff;
    filter: drop-shadow(0 0 6px #6bb6ffcc);
  }
`;

export default Button1;