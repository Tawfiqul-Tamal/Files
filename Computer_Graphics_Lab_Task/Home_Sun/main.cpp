#include <GL/glut.h>
#include <math.h>

// Display function
void display() {
    glClear(GL_COLOR_BUFFER_BIT);

    // Square
    glColor3f(0, 1, 0);  // green
    glBegin(GL_POLYGON);
        glVertex2f(-0.25, -0.25);
        glVertex2f(0.25, -0.25);
        glVertex2f(0.25, 0.25);
        glVertex2f(-0.25, 0.25);
    glEnd();

    // Rectangle
    glColor3f(1, 1, 0);  // yellow
    glBegin(GL_POLYGON);
        glVertex2f(-0.110, -0.25);
        glVertex2f(0.110, -0.25);
        glVertex2f(0.110, 0.100);
        glVertex2f(-0.110, 0.100);
    glEnd();

    // Triangle
    glColor3f(0, 0, 1);  // blue
    glBegin(GL_POLYGON);
        glVertex2f(-0.25, 0.25);
        glVertex2f(0.25, 0.25);
        glVertex2f(0.0, 0.475);
    glEnd();

    // Circle
    glColor3f(1, 1, 0);  // yellow
    float centerX = 0.7;
    float centerY = 0.7;
    float radius = 0.15;

    glBegin(GL_POLYGON);
    for (int i = 0; i <= 360; i++) {
        float angle = i * 3.1416 / 180.0;
        float x = centerX + radius * cos(angle);
        float y = centerY + radius * sin(angle);
        glVertex2f(x, y);
    }
    glEnd();

    glFlush();
}

// Setup background
void setup() {
    glClearColor(1, 1, 1, 1);

}

int main(int argc, char **argv) {
    glutInit(&argc, argv);
    glutInitWindowSize(500, 500);
    glutInitWindowPosition(100, 100);
    glutInitDisplayMode(GLUT_RGB | GLUT_SINGLE);

    glutCreateWindow("Tamal_Home_Sun");

    setup();
    glutDisplayFunc(display);

    glutMainLoop();
    return 0;
}
