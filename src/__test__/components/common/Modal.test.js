import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../../../components/common/Modal";

describe("Modal", () => {
  test("renders with correct title and content", () => {
    const title = "Test Modal";
    const content = "Test Content";
    const onClose = jest.fn();

    render(
      <Modal open={true} onClose={onClose} title={title}>
        {content}
      </Modal>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  test("calls onClose when closed", () => {
    const onClose = jest.fn();

    render(
      <Modal open={true} onClose={onClose} title="Test Modal">
        Test Content
      </Modal>
    );

    // eslint-disable-next-line testing-library/no-node-access
    const backdropElement = document.querySelector('.MuiBackdrop-root');

    fireEvent.click(backdropElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
